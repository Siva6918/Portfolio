import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SwipeableCarousel = ({
  children,
  className = '',
  showDots = true,
  showArrows = false,
  dotPosition = 'bottom'
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const items = React.Children.toArray(children);
  const totalItems = items.length;

  const scrollToItem = useCallback((index) => {
    if (!containerRef.current) return;
    const targetIndex = Math.max(0, Math.min(index, totalItems - 1));
    setActiveIndex(targetIndex);

    const childNode = containerRef.current.children[targetIndex];
    if (childNode) {
      childNode.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  }, [totalItems]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || totalItems === 0) return;
    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.firstElementChild ? container.firstElementChild.offsetWidth : container.offsetWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < totalItems) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, totalItems]);

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    // Threshold for swipe detection (40px)
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped Left -> Go Next
        scrollToItem(activeIndex + 1);
      } else {
        // Swiped Right -> Go Prev
        scrollToItem(activeIndex - 1);
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 py-2 px-1 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, idx) => (
          <div key={idx} className="snap-start shrink-0 w-full max-w-[88vw] sm:max-w-none">
            {item}
          </div>
        ))}
      </div>

      {/* Optional Arrow Controls */}
      {showArrows && totalItems > 1 && (
        <>
          <button
            onClick={() => scrollToItem(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 text-white disabled:opacity-30 border border-slate-700 z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToItem(activeIndex + 1)}
            disabled={activeIndex === totalItems - 1}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 text-white disabled:opacity-30 border border-slate-700 z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Pagination Dot Indicators */}
      {showDots && totalItems > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-3">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToItem(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                  : 'w-1.5 bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SwipeableCarousel;
