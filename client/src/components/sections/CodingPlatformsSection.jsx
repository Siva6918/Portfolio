import React from 'react';
import { Code2, ExternalLink } from 'lucide-react';

const CodingPlatformsSection = ({ profiles = [] }) => {
  return (
    <section className="py-16 relative w-full">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading - Without Numberings */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-300 shadow-sm">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-sky-300">
              Competitive Programming
            </h2>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Coding Profiles & Benchmarks
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profiles.map((p, idx) => {
            const platformPalette = [
              { hex: "#38bdf8", glow: "rgba(56,189,248,0.25)" },
              { hex: "#4ade80", glow: "rgba(74,222,128,0.25)" },
              { hex: "#facc15", glow: "rgba(250,204,21,0.25)" },
            ];
            const c = platformPalette[idx % platformPalette.length];

            return (
              <div
                key={p._id || p.platform}
                className="rounded-2xl border overflow-hidden space-y-4 p-6 transition-all duration-300 relative"
                style={{ background: "rgba(9,9,11,0.88)", borderColor: "rgba(63,63,70,0.65)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = c.hex;
                  e.currentTarget.style.boxShadow = `0 10px 36px -6px ${c.glow}`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(63,63,70,0.65)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                {/* Top accent line */}
                <div className="h-0.5 -mx-6 -mt-6 mb-4" style={{ background: `linear-gradient(90deg, ${c.hex}, transparent 70%)` }} />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border" style={{ background: `${c.hex}14`, color: c.hex, borderColor: `${c.hex}35` }}>
                      0{idx + 1}
                    </span>
                    <h4 className="text-lg font-extrabold text-white">{p.platform}</h4>
                  </div>
                  <a
                    href={p.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border transition-colors"
                    style={{ background: "rgba(24,24,27,0.9)", borderColor: "rgba(63,63,70,0.5)", color: c.hex }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl border" style={{ background: "rgba(24,24,27,0.9)", borderColor: `${c.hex}30` }}>
                    <span className="block text-[10px] font-mono text-zinc-400">Problems Solved</span>
                    <span className="text-lg font-bold font-mono" style={{ color: c.hex }}>{p.problemsSolved}</span>
                  </div>
                  {p.rating && (
                    <div className="p-3 rounded-xl border" style={{ background: "rgba(24,24,27,0.9)", borderColor: "rgba(63,63,70,0.5)" }}>
                      <span className="block text-[10px] font-mono text-zinc-400">Rating / Stars</span>
                      <span className="text-sm font-bold text-purple-300 font-mono">{p.rating}</span>
                    </div>
                  )}
                </div>

                {p.description && (
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {p.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CodingPlatformsSection;

