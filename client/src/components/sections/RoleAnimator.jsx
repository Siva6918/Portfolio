import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal } from 'lucide-react';

const ROLES = [
  { text: 'Software Engineer', color: '#38bdf8', tag: 'CORE' },        // Electric Sky Blue
  { text: 'Software Developer', color: '#a78bfa', tag: 'DEV' },        // Vibrant Violet
  { text: 'Full Stack Developer', color: '#4ade80', tag: 'FULLSTACK' }, // Emerald Green
  { text: 'MERN Developer', color: '#facc15', tag: 'MERN' },           // Vibrant Amber
  { text: 'AI Developer', color: '#f43f5e', tag: 'AI / ML' },          // Vibrant Rose
];

// Typing speeds (ms)
const TYPE_SPEED = 65;       // Speed per letter when typing
const DELETE_SPEED = 30;     // Speed per letter when backspacing
const HOLD_DELAY = 2000;     // Pause when a role is completely typed
const NEXT_ROLE_DELAY = 300; // Pause after deleting before typing next role

/**
 * RoleAnimator
 *
 * Letter-by-letter typewriter animation:
 * - Decreased font size (compact, crisp, elegant)
 * - Card-inspired dynamic color spark (matching timeline and workspace cards)
 * - Space Grotesk font with vivid neon text-shadow and glowing borders
 * - Left tinted spark badge with Sparkles icon
 * - Top glowing accent line
 * - Blinking terminal caret matching the active spark color
 */
const RoleAnimator = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentRole = ROLES[roleIndex];

  useEffect(() => {
    let timeoutId;
    const currentFullText = currentRole.text;

    if (!isDeleting) {
      // TYPING FORWARD
      if (displayText.length < currentFullText.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, TYPE_SPEED);
      } else {
        // Finished typing entire role, hold before deleting
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, HOLD_DELAY);
      }
    } else {
      // BACKSPACING / DELETING
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length - 1));
        }, DELETE_SPEED);
      } else {
        // Finished deleting, move to next role
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        timeoutId = setTimeout(() => {}, NEXT_ROLE_DELAY);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, isDeleting, roleIndex, currentRole]);

  return (
    <div
      className="relative inline-flex items-center min-h-[3rem] select-none py-1.5"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Color-sparked card container (matching timeline card aesthetic) */}
      <div
        className="relative flex items-center gap-3 px-4 py-2 rounded-xl border overflow-hidden transition-all duration-500 shadow-lg"
        style={{
          background: 'rgba(9, 9, 11, 0.88)',
          borderColor: `${currentRole.color}75`,
          boxShadow: `0 0 24px -4px ${currentRole.color}45, 0 4px 18px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Top subtle color spark accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentRole.color}, transparent)`,
          }}
        />

        {/* Tinted icon spark badge */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-500 shrink-0"
          style={{
            background: `${currentRole.color}18`,
            borderColor: `${currentRole.color}45`,
            boxShadow: `0 0 14px ${currentRole.color}40`,
          }}
        >
          <Sparkles
            className="w-3.5 h-3.5 transition-colors duration-500"
            style={{ color: currentRole.color }}
          />
        </div>

        {/* Typed text and caret in Space Grotesk font with decreased font size and color spark glow */}
        <div className="flex items-center">
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: currentRole.color,
              textShadow: `0 0 14px ${currentRole.color}75`,
              transition: 'color 300ms ease, text-shadow 300ms ease',
            }}
            className="font-bold text-sm sm:text-base lg:text-lg tracking-tight"
          >
            {displayText}
          </span>

          {/* Glowing blinking caret in matching spark color */}
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: currentRole.color,
              textShadow: `0 0 12px ${currentRole.color}`,
            }}
            className="inline-block text-base sm:text-lg font-normal ml-0.5 animate-pulse"
          >
            |
          </span>
        </div>

        {/* Micro tag badge */}
        <span
          className="ml-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border transition-all duration-500 hidden sm:inline-block"
          style={{
            background: `${currentRole.color}14`,
            color: currentRole.color,
            borderColor: `${currentRole.color}35`,
          }}
        >
          [{currentRole.tag}]
        </span>
      </div>
    </div>
  );
};

export default RoleAnimator;
