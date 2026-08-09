import { useState, useEffect, useRef } from 'react';

/**
 * useScrollReveal hook observes an element's visibility in the viewport.
 * Triggers once when the element scrolls into view.
 * Degrades gracefully if IntersectionObserver is unsupported or prefers-reduced-motion is active.
 */
export const useScrollReveal = (options = {}) => {
  const { threshold = 0.12, rootMargin = '0px 0px -50px 0px' } = options;
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin]);

  return { ref: elementRef, isVisible };
};

export default useScrollReveal;
