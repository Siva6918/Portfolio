import { useState, useRef, useCallback } from 'react';

/**
 * Upload state machine:
 *   idle → preparing → uploading → processing → completed
 *                                      ↓
 *                                   failed → (retry) → preparing → ...
 *                                      ↓
 *                                  cancelled
 */
export const UPLOAD_STATES = {
  IDLE: 'idle',
  PREPARING: 'preparing',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

const initialState = {
  state: UPLOAD_STATES.IDLE,
  fileName: '',
  fileSize: 0,
  loaded: 0,
  total: 0,
  percent: 0,
  speed: 0,        // bytes/second
  eta: null,       // seconds remaining, or null if not calculable
  error: null,
};

/**
 * useUploadProgress — shared hook for all admin upload locations.
 *
 * Usage:
 *   const up = useUploadProgress();
 *   const url = await up.upload(file, (formData, options) => api.uploadMedia(formData, pwd, options));
 *
 * The second argument to upload() is a factory that receives (formData, { onUploadProgress, signal })
 * and returns an axios promise.
 */
const useUploadProgress = () => {
  const [info, setInfo] = useState(initialState);
  const abortCtrlRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastLoadedRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const speedSamplesRef = useRef([]); // rolling window for smoothed speed
  const isMountedRef = useRef(true);

  // Track mount state so we don't setState after unmount
  const safeSet = useCallback((updater) => {
    if (isMountedRef.current) setInfo(updater);
  }, []);

  const reset = useCallback(() => {
    safeSet(() => ({ ...initialState }));
    startTimeRef.current = null;
    lastLoadedRef.current = 0;
    lastTimestampRef.current = 0;
    speedSamplesRef.current = [];
  }, [safeSet]);

  const cancel = useCallback(() => {
    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort();
    }
  }, []);

  /**
   * Core upload function.
   *
   * @param {File} file - The File object to upload.
   * @param {(formData: FormData, axiosExtras: object) => Promise} apiFn
   *   A function that receives (formData, { onUploadProgress, signal }) and
   *   returns an axios response promise. The caller wraps the existing API
   *   function and passes the extras through.
   * @param {object} [options]
   * @param {string} [options.fieldName='file'] - FormData field name for the file.
   * @param {object} [options.extraFields={}] - Additional FormData fields.
   * @param {FormData} [options.formData] - Pre-built FormData (used when the
   *   caller has already built the FormData, e.g. multipart workspace uploads).
   *   If provided, `file` and `fieldName` are ignored.
   * @returns {Promise<string>} The uploaded file URL from the API response.
   */
  const upload = useCallback(async (file, apiFn, options = {}) => {
    const { fieldName = 'file', extraFields = {}, formData: prebuiltFd } = options;

    // Build FormData
    const fd = prebuiltFd || new FormData();
    if (!prebuiltFd && file) {
      fd.append(fieldName, file);
      Object.entries(extraFields).forEach(([k, v]) => fd.append(k, v));
    }

    const fileName = file?.name || 'file';
    const fileSize = file?.size || 0;

    // Abort any prior in-flight upload
    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort();
    }
    const ctrl = new AbortController();
    abortCtrlRef.current = ctrl;

    // Reset tracking state
    startTimeRef.current = Date.now();
    lastLoadedRef.current = 0;
    lastTimestampRef.current = Date.now();
    speedSamplesRef.current = [];

    safeSet(() => ({
      state: UPLOAD_STATES.PREPARING,
      fileName,
      fileSize,
      loaded: 0,
      total: fileSize,
      percent: 0,
      speed: 0,
      eta: null,
      error: null,
    }));

    const onUploadProgress = (progressEvent) => {
      const { loaded, total } = progressEvent;
      const now = Date.now();
      const elapsedMs = now - startTimeRef.current;

      // Calculate instantaneous speed over the last sample interval
      const intervalMs = now - lastTimestampRef.current;
      const intervalBytes = loaded - lastLoadedRef.current;

      let speed = 0;
      let eta = null;

      if (intervalMs > 0 && intervalBytes >= 0) {
        const instantSpeed = (intervalBytes / intervalMs) * 1000; // bytes/sec
        // Rolling average over last 5 samples for smoothing
        speedSamplesRef.current.push(instantSpeed);
        if (speedSamplesRef.current.length > 5) speedSamplesRef.current.shift();
        speed = speedSamplesRef.current.reduce((a, b) => a + b, 0) / speedSamplesRef.current.length;
      }

      // Only show ETA after at least 1 second elapsed and speed is reliable
      if (elapsedMs >= 1000 && speed > 0 && total > 0) {
        const remaining = total - loaded;
        eta = remaining / speed; // seconds
      }

      const percent = total > 0 ? Math.min(99, Math.round((loaded / total) * 100)) : 0;

      lastLoadedRef.current = loaded;
      lastTimestampRef.current = now;

      safeSet((prev) => ({
        ...prev,
        state: UPLOAD_STATES.UPLOADING,
        loaded,
        total: total || fileSize,
        percent,
        speed,
        eta,
      }));
    };

    try {
      const response = await apiFn(fd, {
        onUploadProgress,
        signal: ctrl.signal,
      });

      // XHR complete — now server is uploading to Cloudinary
      safeSet((prev) => ({
        ...prev,
        state: UPLOAD_STATES.PROCESSING,
        percent: 100,
        loaded: prev.total || fileSize,
        speed: 0,
        eta: null,
      }));

      // Extract URL from response
      const url = response?.data?.url || response?.data?.data?.url || response?.data?.secure_url || '';

      safeSet((prev) => ({
        ...prev,
        state: UPLOAD_STATES.COMPLETED,
        percent: 100,
      }));

      return url;
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED' || ctrl.signal.aborted) {
        safeSet((prev) => ({
          ...prev,
          state: UPLOAD_STATES.CANCELLED,
          error: 'Upload cancelled.',
        }));
        return null;
      }

      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Upload failed. Please try again.';

      safeSet((prev) => ({
        ...prev,
        state: UPLOAD_STATES.FAILED,
        error: message,
      }));

      throw err;
    }
  }, [safeSet]);

  return {
    info,
    upload,
    reset,
    cancel,
    isIdle: info.state === UPLOAD_STATES.IDLE,
    isActive: info.state === UPLOAD_STATES.UPLOADING || info.state === UPLOAD_STATES.PROCESSING || info.state === UPLOAD_STATES.PREPARING,
    isCompleted: info.state === UPLOAD_STATES.COMPLETED,
    isFailed: info.state === UPLOAD_STATES.FAILED,
  };
};

export default useUploadProgress;
