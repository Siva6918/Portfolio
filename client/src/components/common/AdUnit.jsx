import React, { useEffect, useRef } from 'react';

/**
 * AdUnit – a wrapper around a single Google AdSense <ins> element.
 *
 * Rules followed:
 * - Never modifies the AdSense script (it lives in index.html).
 * - Never encourages clicks.
 * - Cleans up properly in React StrictMode to avoid duplicate push() calls.
 * - Collapses gracefully when no ad loads (min-height prevents layout jank).
 *
 * @param {string}  slot      – The ad-slot ID from your AdSense account.
 * @param {string}  format    – AdSense data-ad-format value (default: "auto").
 * @param {boolean} fullWidth – Whether to enable full-width responsive ads.
 * @param {string}  className – Optional extra Tailwind / CSS classes for the wrapper.
 */
const AdUnit = ({
  slot,
  format = 'auto',
  fullWidth = true,
  className = '',
}) => {
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Guard: only push once per mount, and only when adsbygoogle is available.
    if (pushed.current) return;
    try {
      const adsByGoogle = window.adsbygoogle;
      if (adsByGoogle) {
        adsByGoogle.push({});
        pushed.current = true;
      }
    } catch (e) {
      // Silently swallow initialisation errors in dev / ad-blocked environments.
    }

    return () => {
      // Reset so a remount (React StrictMode) can push again cleanly.
      pushed.current = false;
    };
  }, []);

  return (
    /*
     * Outer wrapper:
     * - overflow-hidden   → prevents the <ins> from bleeding outside.
     * - min-h-[90px]      → reserves minimal space so layout is stable even
     *                        when the ad hasn't loaded yet; collapses once
     *                        AdSense decides there's nothing to show.
     * - text-center       → centres the <ins> block within the container.
     */
    <div
      className={`w-full overflow-hidden text-center min-h-[90px] ${className}`}
      aria-label="Advertisement"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8376192922605917"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidth ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdUnit;
