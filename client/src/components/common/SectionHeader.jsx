import React from 'react';
import { motion } from 'framer-motion';

const easeCurve = [0.16, 1, 0.3, 1];

/**
 * SectionHeader
 *
 * Reusable Section Header with:
 * - Color-sparked card pill badge (matching timeline card aesthetic)
 * - Top accent spark line
 * - Tinted glowing icon container
 * - Space Grotesk typography for badge and heading
 * - Subtitle / description
 * - Optional right-aligned action buttons or filters
 */
const SectionHeader = ({
  badgeText,
  icon: Icon,
  color = '#38bdf8',
  title,
  gradientTitle,
  description,
  children,
  className = 'mb-12 sm:mb-14',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}>
      <div>
        {/* Color-sparked card badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.5, ease: easeCurve }}
          className="relative inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border overflow-hidden transition-all duration-300 shadow-md mb-3"
          style={{
            background: 'rgba(9, 9, 11, 0.88)',
            borderColor: `${color}60`,
            boxShadow: `0 0 20px -3px ${color}35, 0 4px 14px rgba(0,0,0,0.35)`,
          }}
        >
          {/* Top accent spark line */}
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />

          {/* Tinted icon container */}
          {Icon && (
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center border shrink-0"
              style={{
                background: `${color}18`,
                borderColor: `${color}40`,
                boxShadow: `0 0 10px ${color}35`,
              }}
            >
              <Icon className="w-3 h-3" style={{ color }} />
            </div>
          )}

          {/* Badge text in Space Grotesk */}
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color,
              textShadow: `0 0 12px ${color}65`,
            }}
            className="text-xs font-bold tracking-wider uppercase"
          >
            {badgeText}
          </span>
        </motion.div>

        {/* Section Heading in Space Grotesk font */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
        >
          {title}
          {gradientTitle && (
            <>
              {' '}
              <span
                style={{
                  color,
                  textShadow: `0 0 24px ${color}45`,
                }}
              >
                {gradientTitle}
              </span>
            </>
          )}
        </motion.h2>

        {/* Subtitle / Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-400 mt-2 max-w-xl leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Right-aligned action slot */}
      {children && (
        <div className="shrink-0 flex items-center gap-2 mt-2 md:mt-0">
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
