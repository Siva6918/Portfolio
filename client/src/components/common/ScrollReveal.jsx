import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal — same safe pattern as RevealOnScroll.
 * Renders visible on first paint, then animates in on scroll.
 */
const ScrollReveal = ({ children, className = '', delay = 0, animation = 'fadeUp' }) => {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setRevealed(true), typeof delay === 'number' && delay < 10 ? delay * 75 : delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ready, delay]);

  const getTransform = () => {
    if (!ready || revealed) return 'translateY(0px) scale(1)';
    if (animation === 'scaleUp') return 'scale(0.96)';
    if (animation === 'fadeDown') return 'translateY(-24px) scale(0.99)';
    return 'translateY(24px) scale(0.99)'; // fadeUp default
  };

  const style = {
    transition: ready ? 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)' : 'none',
    opacity: !ready || revealed ? 1 : 0,
    transform: getTransform(),
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export default ScrollReveal;
