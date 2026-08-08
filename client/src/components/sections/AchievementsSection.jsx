import React from 'react';
import { Trophy } from 'lucide-react';

const AchievementsSection = ({ achievements = [] }) => {
  return (
    <section id="achievements" className="py-20 relative w-full bg-transparent">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-[#a855f7]/10 border border-purple-500/30 dark:border-[#a855f7]/30 flex items-center justify-center text-purple-700 dark:text-[#a855f7]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-purple-700 dark:text-[#a855f7]">
              Recognition & Honors
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#fafafa]">
              Numbered Editorial Achievements
            </h3>
          </div>
        </div>

        {/* Numbered Editorial List Composition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((item, idx) => (
            <div
              key={item._id || item.title}
              className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-[#27272a] hover:border-purple-500 dark:hover:border-[#a855f7]/40 transition-all space-y-3 group relative overflow-hidden"
            >
              {/* Giant Editorial Number watermark */}
              <span className="absolute -right-2 -bottom-4 text-7xl font-extrabold font-mono text-slate-300/40 dark:text-[#27272a]/40 select-none group-hover:text-purple-500/10 dark:group-hover:text-[#a855f7]/10 transition-colors">
                0{idx + 1}
              </span>

              <div className="flex items-center justify-between relative z-10">
                <span className="font-mono text-xs font-bold text-purple-700 dark:text-[#a855f7] px-3 py-1 rounded-full bg-purple-500/10 dark:bg-[#a855f7]/10 border border-purple-500/20 dark:border-[#a855f7]/20">
                  {item.rank}
                </span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-[#a1a1aa]">{item.year}</span>
              </div>

              <h4 className="text-lg font-bold text-slate-900 dark:text-[#fafafa] group-hover:text-purple-700 dark:group-hover:text-[#a855f7] transition-colors relative z-10">
                {item.title}
              </h4>

              <p className="text-xs font-semibold text-slate-800 dark:text-[#a1a1aa] relative z-10">
                {item.event}
              </p>

              <p className="text-xs text-slate-800 dark:text-[#a1a1aa] leading-relaxed pt-1 relative z-10 font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AchievementsSection;
