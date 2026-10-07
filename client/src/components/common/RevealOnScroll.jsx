import React, { useEffect, useRef, useState } from 'react';

/**
 * RevealOnScroll — drop-in replacement.
 * Starts VISIBLE (opacity-1) and only transitions to hidden/revealed
 * once the IntersectionObserver fires, avoiding permanent blank states.
 */
const RevealOnScroll = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false); // wait for mount before hiding

  useEffect(() => {
    // Small delay so first paint is visible, then we set up animations
    const mountTimer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), delay);
          observer.unobserve(el); // fire once only
        }
      },
      { threshold: 0, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ready, delay]);

  // Before ready: fully visible (prevents flash of invisible content)
  // After ready + revealed: visible with transition
  // After ready + not revealed: hidden, waiting
  const style = {
    transition: ready ? 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)' : 'none',
    opacity: !ready || revealed ? 1 : 0,
    transform: !ready || revealed ? 'translateY(0px)' : 'translateY(24px)',
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export default RevealOnScroll;
