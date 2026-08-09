import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, ChevronLeft, ChevronRight, ExternalLink, Award, Sparkles } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';

const AchievementsSection = ({ achievements = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef(null);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const totalItems = achievements.length;
  const maxIndex = Math.max(0, totalItems - visibleCount);

  // Next Slide
  const nextSlide = useCallback(() => {
    if (totalItems === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  }, [totalItems, maxIndex]);

  // Prev Slide
  const prevSlide = useCallback(() => {
    if (totalItems === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  }, [totalItems, maxIndex]);

  // Auto-slide timer (4 seconds)
  useEffect(() => {
    if (isPaused || prefersReducedMotion || totalItems <= visibleCount) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, totalItems, visibleCount, nextSlide]);

  // Touch & Drag Handling
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const threshold = 40; // minimum drag distance in px
    if (dragOffset < -threshold) {
      nextSlide();
    } else if (dragOffset > threshold) {
      prevSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
    setIsPaused(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  if (totalItems === 0) return null;

  return (
    <section 
      id="achievements" 
      className="py-16 relative w-full overflow-hidden"
      aria-label="Achievements Showcase"
    >
      <div className="section-container">
        
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c084fc]/10 border border-[#c084fc]/20 flex items-center justify-center text-[#c084fc]">
              <Trophy className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-xs uppercase font-mono font-semibold tracking-widest text-[#c084fc]">
                Recognition & Honors
              </h2>
              <h3 className="text-2xl font-bold text-[#fafafa]">
                Achievements & Hackathons
              </h3>
            </div>
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous Achievement"
              className="p-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#6366f1] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Achievement"
              className="p-2 rounded-lg bg-[#18181b] border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#6366f1] transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Outer Wrapper */}
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (!isDragging) setIsPaused(false);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          className="relative w-full overflow-hidden focus:outline-none select-none cursor-grab active:cursor-grabbing"
          aria-roledescription="carousel"
          role="region"
        >
          {/* Carousel Track */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% + ${dragOffset}px))`,
              transitionProperty: isDragging ? 'none' : 'transform'
            }}
          >
            {achievements.map((item, idx) => (
              <div
                key={item._id || idx}
                className="shrink-0 px-2.5"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <div className="glass-card p-5 rounded-2xl border border-[#27272a] hover:border-[#c084fc]/40 transition-all duration-300 h-full flex flex-col justify-between group space-y-4 relative overflow-hidden">
                  
                  {/* Top Row: Image / Icon + Rank & Year */}
                  <div className="space-y-3">
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#09090b] border border-[#27272a]">
                      {item.image ? (
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          updatedAt={item.updatedAt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          containerClassName="w-full h-full"
                          fallbackIcon={Trophy}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#c084fc]/10 to-[#6366f1]/10 text-[#c084fc]">
                          <Trophy className="w-8 h-8" />
                        </div>
                      )}

                      {/* Rank Tag */}
                      <div className="absolute top-2 left-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#09090b]/85 backdrop-blur-sm border border-[#c084fc]/30 text-[10px] font-mono font-bold text-[#c084fc] uppercase">
                          {item.rank || 'Honor'}
                        </span>
                      </div>

                      {/* Year Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#09090b]/85 backdrop-blur-sm border border-[#27272a] text-[10px] font-mono text-[#a1a1aa]">
                          {item.year}
                        </span>
                      </div>
                    </div>

                    {/* Title & Event */}
                    <div>
                      <h4 className="text-base font-bold text-[#fafafa] group-hover:text-[#c084fc] transition-colors leading-snug line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs font-medium text-[#a5b4fc] mt-0.5 line-clamp-1">
                        {item.event} {item.organization ? `• ${item.organization}` : ''}
                      </p>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-[#a1a1aa] leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Optional Credential / Link Button */}
                  {(item.link || item.certificate) && (
                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-end">
                      <a
                        href={item.link || item.certificate}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#a5b4fc] hover:text-[#c084fc] transition-colors"
                        aria-label={`View details for ${item.title}`}
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {totalItems > visibleCount && (
          <div className="flex items-center justify-center gap-1.5 mt-6" aria-label="Carousel Pagination">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-6 bg-[#c084fc]'
                    : 'w-2 bg-[#27272a] hover:bg-[#52525b]'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default AchievementsSection;
