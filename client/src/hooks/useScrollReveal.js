import { useState, useEffect, useRef } from 'react';

/**
 * useScrollReveal hook observes an element's visibility in the viewport.
 * When element enters viewport -> isVisible = true
 * When element leaves viewport -> isVisible = false (resets for replay!)
 * Supports both scroll-down and scroll-up repeated triggers.
 * Respects prefers-reduced-motion.
 */
export const useScrollReveal = (options = {}) => {
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px', reenter = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (reenter) {
          // Reset animation state when leaving viewport so it replays!
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentElement);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, reenter]);

  return { ref: elementRef, isVisible };
};

export default useScrollReveal;
