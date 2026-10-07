import React, { useEffect, useState } from 'react';

/**
 * AdminPreloader — full-screen preloader dedicated to the Admin Space.
 * Shown every time /admin is visited. Indigo-themed, auth-sequence style.
 */

const AUTH_STEPS = [
  { label: 'Verifying session token', delay: 0 },
  { label: 'Loading admin modules', delay: 350 },
  { label: 'Fetching portfolio data', delay: 650 },
  { label: 'Initializing dashboard', delay: 900 },
  { label: 'Access granted ✓', delay: 1150 },
];

const AdminPreloader = ({ onDone }) => {
  const [steps, setSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    AUTH_STEPS.forEach((s, i) => {
      setTimeout(() => {
        setSteps(prev => [...prev, i]);
        setProgress(Math.round(((i + 1) / AUTH_STEPS.length) * 100));
      }, s.delay);
    });
    setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDone?.(), 700);
    }, 1550);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-700 ${
        exiting ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100'
      }`}
      style={{ background: '#080810', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
    >
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-950">
        <div className="h-full bg-indigo-400 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Center */}
      <div className="relative z-10 w-full max-w-sm px-6 flex flex-col gap-6">
        {/* Lock icon */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-indigo-400">Admin Space</p>
            <p className="font-mono text-[9px] text-white/20 mt-1 tracking-widest">RESTRICTED ACCESS</p>
          </div>
        </div>

        {/* Auth steps */}
        <div className="bg-[#0e0e1a] border border-indigo-500/10 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-indigo-500/10">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-mono text-[10px] text-indigo-400/60 uppercase tracking-widest">auth.session</span>
          </div>
          <div className="px-4 py-4 space-y-2.5">
            {AUTH_STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-3 font-mono text-[11px] transition-all duration-300" style={{
                opacity: steps.includes(i) ? 1 : 0.2,
                transform: steps.includes(i) ? 'translateX(0)' : 'translateX(-6px)',
              }}>
                {steps.includes(i) && i < AUTH_STEPS.length - 1 ? (
                  i === steps[steps.length - 1] - 0
                    ? <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" style={{ animation: 'softPulse 0.8s ease-in-out infinite' }} />
                    : <span style={{ color: '#27c93f' }}>✓</span>
                ) : steps.includes(i) ? (
                  <span style={{ color: '#27c93f' }}>✓</span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-white/10 shrink-0" />
                )}
                <span style={{ color: i === steps[steps.length - 1] ? '#a5b4fc' : steps.includes(i) ? '#ffffff44' : '#ffffff18' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-indigo-500/10 bg-[#09091399] flex justify-between">
            <span className="font-mono text-[9px] text-indigo-400/40 uppercase tracking-widest">siva-portfolio</span>
            <span className="font-mono text-[9px] text-indigo-400">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom corner */}
      <p className="absolute bottom-6 font-mono text-[9px] text-white/15 uppercase tracking-widest">
        Admin Panel · {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default AdminPreloader;
