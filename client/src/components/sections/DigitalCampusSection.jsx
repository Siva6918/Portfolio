import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../context/AnalyticsContext';

import SwipeableCarousel from '../common/SwipeableCarousel';

const easeCurve = [0.16, 1, 0.3, 1];

const DigitalCampusSection = ({ profile, education = [] }) => {
  const { trackInteraction } = useAnalytics();
  const collegeName = profile?.educationSummary?.college || profile?.college || 'Rajeev Gandhi Memorial College of Engineering and Technology';
  const collegeUrl = profile?.collegeUrl || 'https://www.rgmcet.edu.in/';
  const cgpa = profile?.educationSummary?.cgpa || profile?.cgpa || '8.1';

  const handleCollegeClick = () => {
    trackInteraction('college_click', collegeName, 'Digital Campus', { url: collegeUrl });
  };

  return (
    <section id="about" className="py-20 relative w-full border-t border-slate-200 dark:border-zinc-800/60">
      <div className="section-container">
        
        {/* Editorial Section Header Stagger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-1">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.0, ease: easeCurve }}
              className="text-xs font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-semibold block"
            >
              01 // BACKGROUND & PHILOSOPHY
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white"
            >
              Who I Am & How I Work
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
            className="text-xs font-mono text-slate-600 dark:text-white/50 max-w-xs"
          >
            Software engineering student focused on building robust products with high craftsmanship.
          </motion.p>
        </div>

        {/* Mobile View Carousel (md:hidden) */}
        <div className="block md:hidden">
          <SwipeableCarousel showDots={true}>
            {/* Card 1 */}
            <div className="editorial-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 font-mono text-xs font-bold">
                    01
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">WHO I AM</h3>
                </div>
                <p className="text-sm text-slate-700 dark:text-white/70 leading-relaxed">
                  I'm a Computer Science student at Rajeev Gandhi Memorial College (graduating in 2027 with an 8.1 CGPA). 
                  I focus on modern full-stack web architectures, clean API design, and integrating real-time intelligence into products.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-white/50">
                <span>Location: AP, India</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">CGPA {cgpa}</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="editorial-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 font-mono text-xs font-bold">
                    02
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">WHAT I'M LEARNING</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-white/70 font-mono">
                  <li>• Data Structures & Algorithms (Java)</li>
                  <li>• Production MERN Stack Architecture</li>
                  <li>• System Design & Scalable APIs</li>
                  <li>• AI / ML Fast-API Integration</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-white/50">
                <span>LeetCode: 300+</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">HackerRank 5★</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="editorial-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-mono text-xs font-bold">
                    03
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">WHERE I'M HEADED</h3>
                </div>
                <p className="text-sm text-slate-700 dark:text-white/70 leading-relaxed">
                  Seeking software engineering roles and internships where I can contribute to core platform features, solve complex algorithmic challenges, and collaborate with high-performance teams.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/80">
                <a href={collegeUrl} target="_blank" rel="noreferrer" onClick={handleCollegeClick} className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-white/70">
                  <span className="truncate max-w-[180px]">{collegeName}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </SwipeableCarousel>
        </div>

        {/* 3 Editorial Story Columns (Desktop View md:grid) */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          
          {/* Column 1: WHO I AM */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.0, ease: easeCurve }}
            className="editorial-card p-6 sm:p-8 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 font-mono text-xs font-bold">
                  01
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">WHO I AM</h3>
              </div>

              <p className="text-sm text-slate-700 dark:text-white/70 leading-relaxed">
                I'm a Computer Science student at Rajeev Gandhi Memorial College (graduating in 2027 with an 8.1 CGPA). 
                I focus on modern full-stack web architectures, clean API design, and integrating real-time intelligence into products.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-white/50">
              <span>Location: Andhra Pradesh, India</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">CGPA {cgpa}</span>
            </div>
          </motion.div>

          {/* Column 2: WHAT I'M LEARNING */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
            className="editorial-card p-6 sm:p-8 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 font-mono text-xs font-bold">
                  02
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">WHAT I'M LEARNING</h3>
              </div>

              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-white/70">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Data Structures & Algorithms (Java)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Production MERN Stack Architecture</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>System Design & Scalable APIs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>AI / ML Fast-API Integration</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-white/50">
              <span>LeetCode: 300+ solved</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">HackerRank 5★</span>
            </div>
          </motion.div>

          {/* Column 3: WHERE I'M HEADED */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeCurve }}
            className="editorial-card p-6 sm:p-8 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 font-mono text-xs font-bold">
                  03
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">WHERE I'M HEADED</h3>
              </div>

              <p className="text-sm text-slate-700 dark:text-white/70 leading-relaxed">
                Seeking software engineering roles and internships where I can contribute to core platform features, solve complex algorithmic challenges, and collaborate with high-performance teams.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/80">
              <a
                href={collegeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleCollegeClick}
                className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-white/70 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
              >
                <span className="truncate max-w-[200px]">{collegeName}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default DigitalCampusSection;
