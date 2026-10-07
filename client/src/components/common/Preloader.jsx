import React, { useEffect, useState } from 'react';

// Syntax-highlighted code lines that type in sequence
const CODE_LINES = [
  { indent: 0, tokens: [{ t: 'keyword', v: 'import' }, { t: 'plain', v: ' { Portfolio } ' }, { t: 'keyword', v: 'from' }, { t: 'string', v: " 'siva-reddy'" }] },
  { indent: 0, tokens: [] }, // blank
  { indent: 0, tokens: [{ t: 'keyword', v: 'const' }, { t: 'fn', v: ' Developer' }, { t: 'plain', v: ' = () => {' }] },
  { indent: 1, tokens: [{ t: 'keyword', v: 'return' }, { t: 'plain', v: ' {' }] },
  { indent: 2, tokens: [{ t: 'prop', v: 'name' }, { t: 'plain', v: ': ' }, { t: 'string', v: 'localStorage.getItem("admin_name") || "Venkata Siva Reddy"' }, { t: 'plain', v: ',' }] },
  { indent: 2, tokens: [{ t: 'prop', v: 'role' }, { t: 'plain', v: ': ' }, { t: 'string', v: '"Full Stack Developer"' }, { t: 'plain', v: ',' }] },
  { indent: 2, tokens: [{ t: 'prop', v: 'status' }, { t: 'plain', v: ': ' }, { t: 'string', v: '"ready ✓"' }] },
  { indent: 1, tokens: [{ t: 'plain', v: '}' }] },
  { indent: 0, tokens: [{ t: 'plain', v: '}' }] },
];

const TOKEN_COLORS = {
  keyword: '#c792ea',
  fn:      '#82aaff',
  string:  '#c3e88d',
  prop:    '#f78c6c',
  plain:   '#cdd3de',
};

const Preloader = ({ onDone }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reveal lines one by one
  useEffect(() => {
    const timers = CODE_LINES.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), 180 + i * 180)
    );
    // Done after all lines
    const done = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDone?.(), 700);
    }, 180 + CODE_LINES.length * 180 + 400);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, []);

  // Progress bar tied to line reveal
  useEffect(() => {
    setProgress(Math.round((visibleLines / CODE_LINES.length) * 100));
  }, [visibleLines]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0d0d] transition-all duration-700 ${
        exiting ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
    >
      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Top progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5">
        <div className="h-full bg-[#c792ea] transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col gap-6">
        {/* Editor header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 font-mono text-[11px] text-white/30 tracking-widest">portfolio.js — loading</span>
        </div>

        {/* Code block */}
        <div className="bg-[#111318] border border-white/[0.06] rounded-xl overflow-hidden shadow-2xl">
          {/* Line numbers + code */}
          <div className="p-5 font-mono text-[12px] leading-7 min-h-[280px]">
            {CODE_LINES.map((line, i) => (
              <div
                key={i}
                className="flex gap-4 items-start transition-all duration-300"
                style={{
                  opacity: i < visibleLines ? 1 : 0,
                  transform: i < visibleLines ? 'translateX(0)' : 'translateX(-8px)',
                }}
              >
                {/* Line number */}
                <span className="select-none w-5 text-right shrink-0" style={{ color: 'rgba(255,255,255,0.15)' }}>
                  {i + 1}
                </span>
                {/* Indented code */}
                <span>
                  {'  '.repeat(line.indent)}
                  {line.tokens.map((tok, j) => (
                    <span key={j} style={{ color: TOKEN_COLORS[tok.t] }}>{tok.v}</span>
                  ))}
                  {/* Blinking cursor on current line */}
                  {i === visibleLines - 1 && !exiting && (
                    <span
                      className="inline-block w-[7px] h-[14px] ml-px align-middle"
                      style={{ background: '#c792ea', animation: 'softPulse 0.9s ease-in-out infinite' }}
                    />
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Status bar */}
          <div className="px-4 py-2 border-t border-white/[0.05] flex items-center justify-between bg-[#0e1117]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#27c93f] animate-pulse" />
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                {progress < 100 ? 'Compiling…' : 'Build complete'}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#c792ea]">{progress}%</span>
          </div>
        </div>

        {/* Name */}
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/25">
            SIVA REDDY · Portfolio
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
