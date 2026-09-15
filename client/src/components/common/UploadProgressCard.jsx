import React from 'react';
import {
  Upload, CheckCircle2, XCircle, Loader2, AlertTriangle, X, RefreshCw, Ban
} from 'lucide-react';
import { UPLOAD_STATES } from '../../hooks/useUploadProgress';

/**
 * Format bytes to human-readable size string.
 */
const fmt = (bytes) => {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Format speed to human-readable string.
 */
const fmtSpeed = (bytesPerSec) => {
  if (!bytesPerSec || bytesPerSec <= 0) return null;
  return fmt(bytesPerSec) + '/s';
};

/**
 * Format ETA to human-readable string.
 */
const fmtEta = (seconds) => {
  if (seconds === null || seconds === undefined || seconds <= 0) return null;
  if (seconds < 5) return '< 5 seconds';
  if (seconds < 60) return `~${Math.round(seconds)} seconds`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `~${mins}m ${secs}s`;
};

/**
 * State configuration: icon, color, label.
 */
const STATE_CONFIG = {
  [UPLOAD_STATES.IDLE]: {
    icon: Upload,
    color: '#a1a1aa',
    label: 'Ready',
    barColor: '#3f3f4e',
  },
  [UPLOAD_STATES.PREPARING]: {
    icon: Loader2,
    color: '#6366f1',
    label: 'Preparing…',
    barColor: '#6366f1',
    spin: true,
  },
  [UPLOAD_STATES.UPLOADING]: {
    icon: Upload,
    color: '#ef4444',
    label: 'Uploading…',
    barColor: 'linear-gradient(90deg, #ef4444, #fb7185)',
  },
  [UPLOAD_STATES.PROCESSING]: {
    icon: Loader2,
    color: '#f59e0b',
    label: 'Processing…',
    barColor: '#f59e0b',
    spin: true,
  },
  [UPLOAD_STATES.COMPLETED]: {
    icon: CheckCircle2,
    color: '#10b981',
    label: 'Upload complete',
    barColor: '#10b981',
  },
  [UPLOAD_STATES.FAILED]: {
    icon: XCircle,
    color: '#ef4444',
    label: 'Upload failed',
    barColor: '#ef4444',
  },
  [UPLOAD_STATES.CANCELLED]: {
    icon: Ban,
    color: '#a1a1aa',
    label: 'Upload cancelled',
    barColor: '#3f3f4e',
  },
};

/**
 * UploadProgressCard — shows real upload progress for a single file slot.
 *
 * Props:
 *   info      — from useUploadProgress().info
 *   onCancel  — from useUploadProgress().cancel
 *   onRetry   — callback to retry (caller re-triggers upload)
 *   onDismiss — callback to dismiss/reset (caller calls reset())
 *   label     — optional label like "Cover Photo" or "Resource File"
 *   compact   — boolean, render a more compact version
 */
const UploadProgressCard = ({
  info,
  onCancel,
  onRetry,
  onDismiss,
  label = '',
  compact = false,
}) => {
  if (!info || info.state === UPLOAD_STATES.IDLE) return null;

  const cfg = STATE_CONFIG[info.state] || STATE_CONFIG[UPLOAD_STATES.IDLE];
  const Icon = cfg.icon;

  const isActive = info.state === UPLOAD_STATES.UPLOADING || info.state === UPLOAD_STATES.PREPARING;
  const isProcessing = info.state === UPLOAD_STATES.PROCESSING;
  const isCompleted = info.state === UPLOAD_STATES.COMPLETED;
  const isFailed = info.state === UPLOAD_STATES.FAILED;
  const isCancelled = info.state === UPLOAD_STATES.CANCELLED;

  const speedStr = fmtSpeed(info.speed);
  const etaStr = fmtEta(info.eta);
  const showEta = info.state === UPLOAD_STATES.UPLOADING && info.percent < 99;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all"
      style={{
        background: '#0d0d11',
        borderColor: cfg.color + '40',
      }}
      role="region"
      aria-label={`Upload progress${label ? ': ' + label : ''}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        {/* State icon */}
        <div
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: cfg.color + '18', border: `1px solid ${cfg.color}40` }}
        >
          <Icon
            className={`w-4 h-4 ${cfg.spin ? 'animate-spin' : ''}`}
            style={{ color: cfg.color }}
          />
        </div>

        {/* File name + label */}
        <div className="min-w-0 flex-1">
          {label && (
            <span
              className="text-[9px] font-mono uppercase font-bold tracking-wider block mb-0.5"
              style={{ color: cfg.color }}
            >
              {label}
            </span>
          )}
          <p className="text-xs font-bold text-[#fafafa] truncate leading-tight">
            {info.fileName || 'File'}
          </p>
          <p
            className="text-[10px] font-mono mt-0.5 font-semibold"
            style={{ color: cfg.color }}
          >
            {cfg.label}
            {isCompleted && ' ✓'}
          </p>
        </div>

        {/* Dismiss / Cancel */}
        <div className="flex items-center gap-1 shrink-0">
          {(isActive || isProcessing) && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 rounded-lg hover:bg-[#2d2d3a] transition-colors text-[#a1a1aa] hover:text-white"
              title="Cancel upload"
              aria-label="Cancel upload"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {(isCompleted || isCancelled) && onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 rounded-lg hover:bg-[#2d2d3a] transition-colors text-[#a1a1aa] hover:text-white"
              title="Dismiss"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {!compact && (
        <div className="px-4 pb-1">
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: '#2d2d3a' }}
            role="progressbar"
            aria-valuenow={info.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${info.percent}% uploaded`}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${info.percent}%`,
                background: cfg.barColor,
              }}
            />
          </div>
        </div>
      )}

      {/* Stats row */}
      {!compact && (info.state === UPLOAD_STATES.UPLOADING || isProcessing || isCompleted) && (
        <div className="px-4 pb-3 flex flex-wrap items-center gap-x-4 gap-y-0.5">
          {/* Bytes */}
          {info.total > 0 && (
            <span className="text-[10px] font-mono text-[#a1a1aa]">
              {fmt(info.loaded)} / {fmt(info.total)}
            </span>
          )}

          {/* Percent */}
          {info.state === UPLOAD_STATES.UPLOADING && (
            <span
              className="text-[10px] font-mono font-bold"
              style={{ color: cfg.color }}
            >
              {info.percent}%
            </span>
          )}

          {/* Speed */}
          {showEta && speedStr && (
            <span className="text-[10px] font-mono text-[#a1a1aa]">
              Speed: <span className="text-[#fafafa] font-semibold">{speedStr}</span>
            </span>
          )}

          {/* ETA */}
          {showEta && (
            <span className="text-[10px] font-mono text-[#a1a1aa]">
              ETA:{' '}
              <span className="text-[#fafafa] font-semibold">
                {etaStr || 'Calculating…'}
              </span>
            </span>
          )}
        </div>
      )}

      {/* Error message + retry */}
      {isFailed && (
        <div className="px-4 pb-3 space-y-2">
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[11px] font-mono text-red-400 leading-relaxed">
              {info.error || 'Upload failed. Please try again.'}
            </p>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ef4444]/15 hover:bg-[#ef4444]/25 border border-[#ef4444]/30 text-[#ef4444] text-xs font-mono font-bold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Upload</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadProgressCard;
