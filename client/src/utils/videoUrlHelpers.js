/**
 * Safe Video URL Parser & Normalizer for External Videos (YouTube & Google Drive)
 * Client-side utility for real-time validation and preview generation.
 */

export const parseYouTubeUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return null;
  try {
    const url = new URL(urlStr.trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, '');

    let videoId = null;

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      } else if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/')[2];
      } else if (url.pathname.startsWith('/shorts/')) {
        videoId = url.pathname.split('/')[2];
      } else if (url.pathname.startsWith('/v/')) {
        videoId = url.pathname.split('/')[2];
      }
    } else if (host === 'youtu.be') {
      videoId = url.pathname.slice(1).split('/')[0];
    }

    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return {
        provider: 'youtube',
        id: videoId,
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
        cleanUrl: `https://www.youtube.com/watch?v=${videoId}`,
        normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`
      };
    }
  } catch (e) {}
  return null;
};

export const parseGoogleDriveUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return null;
  try {
    const url = new URL(urlStr.trim());
    const host = url.hostname.toLowerCase();

    if (!host.includes('drive.google.com') && !host.includes('docs.google.com')) {
      return null;
    }

    let fileId = null;

    // Pattern 1: /file/d/FILE_ID/...
    const fileDMatch = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      fileId = fileDMatch[1];
    }

    // Pattern 2: ?id=FILE_ID
    if (!fileId && url.searchParams.has('id')) {
      fileId = url.searchParams.get('id');
    }

    // Pattern 3: /d/FILE_ID/...
    if (!fileId) {
      const dMatch = url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (dMatch && dMatch[1]) {
        fileId = dMatch[1];
      }
    }

    if (fileId && fileId.length >= 10 && /^[a-zA-Z0-9_-]+$/.test(fileId)) {
      return {
        provider: 'google_drive',
        id: fileId,
        fileId,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        cleanUrl: `https://drive.google.com/file/d/${fileId}/view`,
        normalizedUrl: `https://drive.google.com/file/d/${fileId}/view`
      };
    }
  } catch (e) {}
  return null;
};

export const validateExternalVideoUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string' || !urlStr.trim()) {
    return {
      isValid: false,
      valid: false,
      provider: null,
      error: 'Video URL is required.'
    };
  }

  const yt = parseYouTubeUrl(urlStr);
  if (yt) {
    return {
      isValid: true,
      valid: true,
      ...yt
    };
  }

  const gd = parseGoogleDriveUrl(urlStr);
  if (gd) {
    return {
      isValid: true,
      valid: true,
      ...gd
    };
  }

  return {
    isValid: false,
    valid: false,
    provider: null,
    error: 'Invalid or unsupported video URL. Only YouTube (watch, youtu.be, embed, shorts) and Google Drive links are supported.'
  };
};
