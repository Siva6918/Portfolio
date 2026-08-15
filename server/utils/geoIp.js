/**
 * Coarse Geo-IP Location Resolver
 * Resolves country & city from request headers or free-tier IP lookup.
 * Strictly respects privacy: Coarse city/country level only, NO GPS or precision tracking.
 */

const ipCache = new Map();
const MAX_CACHE_SIZE = 1000;

/**
 * Extract best client IP address
 */
const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    if (ips.length > 0 && ips[0]) return ips[0];
  }
  return req.headers['cf-connecting-ip'] ||
         req.headers['x-real-ip'] ||
         req.socket?.remoteAddress ||
         '127.0.0.1';
};

/**
 * Check if IP is local/private
 */
const isPrivateIp = (ip) => {
  if (!ip) return true;
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.2') ||
    ip.startsWith('172.3') ||
    ip.startsWith('fc00:') ||
    ip.startsWith('fe80:')
  );
};

/**
 * Resolve coarse location (Country & City) from request
 * @param {object} req - Express Request
 * @returns {Promise<{ country: string, city: string }>}
 */
const resolveCoarseLocation = async (req) => {
  // 1. Check CDN / Cloud provider headers (Cloudflare, Vercel, GCP, AWS)
  const headerCountry = req.headers['cf-ipcountry'] || 
                        req.headers['x-vercel-ip-country'] || 
                        req.headers['x-appengine-country'] || 
                        req.headers['x-country'];
                        
  const headerCity = req.headers['cf-ipcity'] || 
                     req.headers['x-vercel-ip-city'] || 
                     req.headers['x-appengine-city'] || 
                     req.headers['x-city'];

  if (headerCountry && headerCountry !== 'XX' && headerCountry !== 'T1') {
    return {
      country: headerCountry,
      city: headerCity ? decodeURIComponent(headerCity) : 'Unknown'
    };
  }

  const clientIp = getClientIp(req);

  // 2. Local/Private IP handling
  if (isPrivateIp(clientIp)) {
    return {
      country: 'Localhost / Dev',
      city: 'Local'
    };
  }

  // 3. Check memory cache
  if (ipCache.has(clientIp)) {
    return ipCache.get(clientIp);
  }

  // 4. Non-blocking free lookup fallback (e.g. ip-api.com json)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2s max timeout

    const res = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,city`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success') {
        const result = {
          country: data.country || 'Unknown',
          city: data.city || 'Unknown'
        };

        if (ipCache.size >= MAX_CACHE_SIZE) {
          const firstKey = ipCache.keys().next().value;
          ipCache.delete(firstKey);
        }
        ipCache.set(clientIp, result);
        return result;
      }
    }
  } catch (err) {
    // Silently fall back if external lookup times out or fails
  }

  return {
    country: 'Direct / Unknown',
    city: 'Unknown'
  };
};

module.exports = {
  getClientIp,
  resolveCoarseLocation
};
