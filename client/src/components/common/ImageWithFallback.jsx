import React, { useState, useEffect } from 'react';
import { resolveMediaUrl } from '../../services/api';
import { ImageOff, Sparkles } from 'lucide-react';

/**
 * ImageWithFallback renders an image using resolveMediaUrl.
 * Handles missing src, loading state, broken URLs, and cache-busting via updatedAt.
 * If the image fails to load or is missing, it displays a clean fallback UI instead of a broken icon.
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
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedUrl = resolveMediaUrl(src, updatedAt);
  const resolvedFallback = fallbackSrc ? resolveMediaUrl(fallbackSrc) : null;

  useEffect(() => {
    setImgError(false);
    setIsLoaded(false);
  }, [src, updatedAt]);

  if (!src || imgError) {
    if (resolvedFallback && !imgError) {
      return (
        <div className={`relative overflow-hidden bg-[#18181b] ${containerClassName}`}>
          <img
            src={resolvedFallback}
            alt={alt}
            loading={loading}
            className={className}
            onError={() => setImgError(true)}
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
        src={resolvedUrl}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setImgError(true)}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
};

export default ImageWithFallback;
