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
          {profiles.map((p) => (
            <div
              key={p._id || p.platform}
              className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-4 hover:border-sky-400/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{p.platform}</h4>
                <a
                  href={p.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-sky-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="block text-[10px] font-mono text-slate-400">Problems Solved</span>
                  <span className="text-lg font-bold text-sky-300 font-mono">{p.problemsSolved}</span>
                </div>
                {p.rating && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Rating / Stars</span>
                    <span className="text-sm font-bold text-purple-300 font-mono">{p.rating}</span>
                  </div>
                )}
              </div>

              {p.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {p.description}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CodingPlatformsSection;
