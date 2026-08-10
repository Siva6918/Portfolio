import React from 'react';
import { motion } from 'framer-motion';

const easeCurve = [0.16, 1, 0.3, 1];

const defaultAchievementsFallback = [
  {
    _id: '1',
    title: '1st Rank - College Kaggle Competition',
    rank: '1st Rank',
    event: 'Annual Kaggle Data Science & Machine Learning Hackathon',
    organization: 'Rajeev Gandhi Memorial College of Engineering and Technology',
    year: '2026',
    description: 'Secured top place by engineering high-accuracy predictive models and data preprocessing pipelines.'
  },
  {
    _id: '2',
    title: '2nd Rank - College Web Development Event',
    rank: '2nd Rank',
    event: 'WebTech Hackathon & UI Engineering Challenge',
    organization: 'Rajeev Gandhi Memorial College of Engineering and Technology',
    year: '2025',
    description: 'Developed an interactive, high-performance web platform under strict time constraints.'
  },
  {
    _id: '3',
    title: '2nd Rank - College Coding Event',
    rank: '2nd Rank',
    event: 'Algorithmic Coding & Problem Solving Contest',
    organization: 'Rajeev Gandhi Memorial College of Engineering and Technology',
    year: '2024',
    description: 'Solved complex Data Structures and Algorithm challenges within competitive speed benchmarks.'
  }
];

const AchievementsSection = ({ achievements = [] }) => {
  const activeItems = achievements.length > 0 ? achievements : defaultAchievementsFallback;

  return (
    <section id="achievements" className="py-20 relative w-full border-t border-slate-200 dark:border-zinc-800/60">
      <div className="section-container">
        
        {/* Header Stagger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.0, ease: easeCurve }}
              className="text-xs font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-semibold block"
            >
              07 // RECOGNITION & HONORS
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1"
            >
              Achievements & Competition Ranks
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
            className="text-xs font-mono text-slate-600 dark:text-white/50 max-w-xs"
          >
            Hackathons, competitive algorithmic contests, and data science competitions.
          </motion.p>
        </div>

        {/* Editorial Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeItems.map((item, idx) => (
            <motion.div
              key={item._id || item.title || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: easeCurve }}
              className="editorial-card p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:border-amber-400 dark:hover:border-amber-500/40 transition-all duration-200 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 font-mono text-xs font-bold">
                    {item.rank}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-white/50">{item.year}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-700 dark:text-white/70 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-zinc-800/80 text-[11px] font-mono text-slate-500 dark:text-white/50">
                <span>{item.event}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AchievementsSection;
