import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { resolveMediaUrl } from '../../services/api';
import { ImageOff, Sparkles } from 'lucide-react';

/**
 * ImageWithFallback renders an image using resolveMediaUrl.
 * Robustly handles missing src, cached/Base64 instant loads, loading states, and fallback UI.
 */
const ImageWithFallback = ({
  src,
  alt = 'Image',
  updatedAt,
  className = '',
  containerClassName = '',
  fallbackSrc,
  fallbackIcon: FallbackIcon = Sparkles,
  aspectRatio = 'aspect-video',
  loading = 'lazy'
}) => {
  const [imgError, setImgError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);
  const fallbackImgRef = useRef(null);

  const resolvedUrl = resolveMediaUrl(src, updatedAt);
  const resolvedFallback = fallbackSrc ? resolveMediaUrl(fallbackSrc) : null;
  const isDataUri = resolvedUrl?.startsWith('data:');
  const actualLoading = isDataUri ? 'eager' : loading;

  useEffect(() => {
    setImgError(false);
    setFallbackError(false);
    setIsLoaded(false);
  }, [src, updatedAt]);

  // Synchronously check if image is already complete (cached / Base64 instant load)
  const checkComplete = () => {
    if (imgRef.current) {
      if (imgRef.current.complete) {
        if (imgRef.current.naturalWidth > 0) {
          setIsLoaded(true);
        } else if (imgRef.current.naturalWidth === 0 && imgRef.current.src) {
          setImgError(true);
        }
      }
    }
  };

  useLayoutEffect(() => {
    checkComplete();
  }, [resolvedUrl]);

  useEffect(() => {
    checkComplete();
  }, [resolvedUrl]);

  if (!src || imgError) {
    if (resolvedFallback && !fallbackError) {
      return (
        <div className={`relative overflow-hidden bg-[#18181b] ${containerClassName}`}>
          <img
            ref={fallbackImgRef}
            src={resolvedFallback}
            alt={alt}
            loading={actualLoading}
            className={className}
            onLoad={() => {
              if (fallbackImgRef.current && fallbackImgRef.current.naturalWidth === 0) {
                setFallbackError(true);
              }
            }}
            onError={() => setFallbackError(true)}
          />
        </div>
      );
    }

    return (
      <div className={`flex flex-col items-center justify-center bg-[#18181b] border border-[#27272a] text-[#52525b] p-4 ${containerClassName || aspectRatio}`}>
        <FallbackIcon className="w-6 h-6 mb-1 text-[#6366f1] opacity-70" />
        <span className="text-[10px] font-mono text-[#71717a] font-medium truncate max-w-full px-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#18181b] ${containerClassName}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#18181b] animate-pulse flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[#6366f1]/40 animate-spin" />
        </div>
      )}
      <img
        ref={imgRef}
        src={resolvedUrl}
        alt={alt}
        loading={actualLoading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setImgError(true)}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
};

export default ImageWithFallback;

