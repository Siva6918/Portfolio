import { useEffect } from 'react';

/**
 * useScrollObserver
 *
 * Lightweight, high-performance IntersectionObserver hook that manages
 * replayable scroll animations.
 *
 * - When an element with `.animate-on-scroll` enters the viewport:
 *     adds `.is-visible` -> CSS @keyframe animation plays.
 * - When it leaves the viewport (scrolling down or up):
 *     removes `.is-visible` -> animation state is completely reset.
 * - When it enters the viewport again:
 *     re-adds `.is-visible` -> animation plays AGAIN cleanly.
 *
 * Respects `prefers-reduced-motion: reduce`.
 * Cleans up all observers on unmount to prevent leaks.
 */
export const useScrollObserver = () => {
  useEffect(() => {
    // 1. Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    // 2. Setup reusable IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animation on enter
            entry.target.classList.add('is-visible');
          } else {
            // Reset animation state on leave so it replays repeatedly!
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    // 3. Observe initial elements
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    // 4. Watch for dynamic elements added to DOM
    const mutationObserver = new MutationObserver(() => {
      const currentEls = document.querySelectorAll('.animate-on-scroll');
      currentEls.forEach((el) => observer.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);
};

export default useScrollObserver;
