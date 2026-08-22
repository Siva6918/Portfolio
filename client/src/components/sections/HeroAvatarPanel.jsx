import React, { useState } from 'react';

/**
 * HeroAvatarPanel — desktop-only circular avatar with:
 *  • Sonar wave rings pulsing outward
 *  • Avatar image gently floating up (hero-avatar-float)
 *  • Inner slow-rotating conic accent ring
 *  • Soft ambient glow
 *  • 3 floating labels positioned outside the circle, not overlapping it
 */
const HeroAvatarPanel = ({ avatarSrc, cgpa }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError,  setImgError]  = useState(false);

  const showFallback = !avatarSrc || imgError;

  // Labels sit in the padding zone between the avatar and the component edge.
  // Negative translate pulls them away from the circle without overlapping it.
  const floatLabels = [
    {
      text: 'Full Stack',
      icon: '⬡',
      className: 'hero-float',
      style: { top: '6%', left: '2%' },
    },
    {
      text: `${cgpa} CGPA`,
      icon: '◈',
      className: 'hero-float-d1',
      style: { bottom: '10%', left: '0%' },
    },
    {
      text: 'Open to Work',
      icon: '●',
      className: 'hero-float-d2',
      style: { top: '10%', right: '0%' },
    },
  ];

  return (
    // Extra padding so wave rings and labels have room without overflow
    <div
      className="relative flex items-center justify-center w-full select-none"
      style={{ minHeight: '380px', padding: '60px 80px' }}
    >

      {/* ── Ambient radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none hero-glow-pulse"
        style={{
          background:
            'radial-gradient(ellipse 65% 65% at 50% 50%,' +
            'rgba(99,102,241,0.15) 0%,rgba(168,85,247,0.08) 50%,transparent 75%)',
          filter: 'blur(24px)',
          zIndex: 0,
        }}
      />

      {/* ── Sonar wave rings — start at avatar edge, expand outward ── */}
      {['hero-wave-1','hero-wave-2','hero-wave-3'].map((cls) => (
        <div
          key={cls}
          className={`absolute rounded-full pointer-events-none ${cls}`}
          style={{
            width: '200px',
            height: '200px',
            border: '1.5px solid rgba(99,102,241,0.40)',
            zIndex: 1,
          }}
        />
      ))}

      {/* ── Rotating conic accent ring ── */}
      <div
        className="absolute hero-ring-rotate"
        style={{
          width: '216px',
          height: '216px',
          borderRadius: '50%',
          border: '2px solid transparent',
          backgroundImage:
            'conic-gradient(from 0deg,' +
            'rgba(99,102,241,0.80) 0%,' +
            'rgba(168,85,247,0.55) 30%,' +
            'transparent 55%,' +
            'rgba(99,102,241,0.15) 70%,' +
            'rgba(99,102,241,0.80) 100%)',
          backgroundOrigin: 'border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
          zIndex: 2,
        }}
      />

      {/* ── Circular avatar frame ── */}
      <div
        className="relative z-10 rounded-full overflow-hidden shrink-0"
        style={{
          width: '200px',
          height: '200px',
          boxShadow:
            '0 0 0 2.5px rgba(99,102,241,0.40),' +
            '0 0 0 6px rgba(99,102,241,0.10),' +
            '0 20px 50px rgba(0,0,0,0.30)',
        }}
      >
        {/* Initials fallback */}
        {showFallback && (
          <div
            className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-4xl"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
          >
            VS
          </div>
        )}

        {/* Avatar — floats upward */}
        {avatarSrc && !imgError && (
          <img
            src={avatarSrc}
            alt="Venkata Siva Reddy — Software Engineer"
            className="w-full h-full hero-avatar-float"
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 500ms ease',
              display: 'block',
            }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* ── Floating labels — outside the circle ── */}
      {floatLabels.map((label) => (
        <div
          key={label.text}
          className={`absolute z-20 ${label.className}`}
          style={label.style}
        >
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        text-[11px] font-mono font-semibold whitespace-nowrap cursor-default
                        border border-indigo-500/25 dark:border-indigo-400/20
                        bg-white/90 dark:bg-zinc-900/90
                        text-indigo-700 dark:text-indigo-300
                        backdrop-blur-sm
                        transition-all duration-200 hover:-translate-y-0.5"
            style={{
              boxShadow:
                '0 4px 14px rgba(0,0,0,0.10),' +
                '0 0 0 1px rgba(99,102,241,0.08),' +
                '0 0 8px rgba(99,102,241,0.10)',
            }}
          >
            <span className="opacity-60 text-[9px]">{label.icon}</span>
            <span>{label.text}</span>
          </div>
        </div>
      ))}

    </div>
  );
};

export default HeroAvatarPanel;
