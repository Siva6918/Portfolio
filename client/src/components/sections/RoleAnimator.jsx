import React, { useState, useEffect, useRef, useCallback } from 'react';

const ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'MERN Stack Developer',
  'AI Integration Developer',
];

// How long each word takes to appear (ms)
const WORD_STAGGER = 110;
// How long the complete role stays visible (ms)
const ROLE_DISPLAY_MS = 3000;
// Exit / enter transition duration (ms)
const TRANSITION_MS = 400;

/**
 * RoleAnimator
 *
 * Displays one role at a time, starting with "Software Engineer".
 * Each role enters word-by-word (staggered reveal), stays for a
 * moment, then exits with fade+slide-up before the next role
 * enters with fade+slide-down.
 *
 * A fixed min-height container prevents layout shift when the role
 * text changes.
 */
const RoleAnimator = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  // 'entering' | 'visible' | 'exiting'
  const [phase, setPhase] = useState('entering');
  const [visibleWords, setVisibleWords] = useState(0);

  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const startRoleSequence = useCallback(
    (index) => {
      const words = ROLES[index].split(' ');

      setRoleIndex(index);
      setVisibleWords(0);
      setPhase('entering');

      // Reveal words one-by-one
      words.forEach((_, wi) => {
        addTimer(() => {
          setVisibleWords(wi + 1);
        }, wi * WORD_STAGGER + 50);
      });

      // After all words revealed, switch to visible
      const allWordsDelay = words.length * WORD_STAGGER + 50;
      addTimer(() => {
        setPhase('visible');
      }, allWordsDelay);

      // After display period, exit
      addTimer(() => {
        setPhase('exiting');
      }, allWordsDelay + ROLE_DISPLAY_MS);

      // After exit, start next role
      addTimer(() => {
        const nextIndex = (index + 1) % ROLES.length;
        startRoleSequence(nextIndex);
      }, allWordsDelay + ROLE_DISPLAY_MS + TRANSITION_MS + 80);
    },
    [addTimer] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    startRoleSequence(0);
    return () => clearTimers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const words = ROLES[roleIndex].split(' ');

  // Outer row transforms for enter/exit
  const getRowStyle = () => {
    if (phase === 'exiting') {
      return {
        opacity: 0,
        transform: 'translateY(-8px)',
        transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`,
      };
    }
    return {
      opacity: 1,
      transform: 'translateY(0)',
      transition: phase === 'visible'
        ? `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`
        : undefined,
    };
  };

  return (
    /* min-height sized to accommodate the tallest role to prevent layout shift */
    <div
      style={{ minHeight: '2.6rem', overflow: 'hidden', position: 'relative' }}
      aria-live="polite"
      aria-atomic="true"
    >
      <div style={getRowStyle()} className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        {words.map((word, wi) => {
          const isVisible = wi < visibleWords;
          return (
            <span
              key={`${roleIndex}-${wi}`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
                transition: `opacity 220ms ease, transform 220ms ease`,
                display: 'inline-block',
              }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700 dark:from-indigo-300 dark:via-purple-300 dark:to-amber-200 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight"
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default RoleAnimator;
