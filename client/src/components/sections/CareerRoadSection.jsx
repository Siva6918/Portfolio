import React, { useState } from 'react';
import { GraduationCap, Cpu, Code2, FlaskConical, Briefcase, Rocket, Trophy, Target, Eye, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CareerRoadDetailModal from '../common/CareerRoadDetailModal';

const easeCurve = [0.16, 1, 0.3, 1];

const iconMap = {
  GraduationCap, Cpu, Code2, FlaskConical, Briefcase, Rocket, Trophy, Target
};

const defaultNodes = [
  { id: 0, year: '2023', title: 'Education', subtitle: 'B.Tech CSE — RGMCET', desc: 'Core CS fundamentals, 8.1 CGPA.', status: 'completed', icon: GraduationCap },
  { id: 1, year: '2023–24', title: 'DSA & Programming', subtitle: '300+ Problems Solved', desc: 'Arrays, DP, Graphs, Trees — optimal time-space complexity.', status: 'completed', icon: Cpu },
  { id: 2, year: '2024', title: 'MERN Stack', subtitle: 'React, Node.js, Express, MongoDB', desc: 'Production full-stack web applications & REST APIs.', status: 'completed', icon: Code2 },
  { id: 3, year: '2024–25', title: 'Internships', subtitle: 'Software Engineering Experience', desc: 'Full-stack development, cloud backends, API design.', status: 'active', icon: Briefcase },
  { id: 4, year: '2025', title: 'Projects', subtitle: 'Production Deployments', desc: 'NutriCloud, DocSpot, Candidate Rank — full-stack apps.', status: 'active', icon: FlaskConical },
  { id: 5, year: '2025–26', title: 'Certifications', subtitle: 'Industry Credentials', desc: 'Cloud & software engineering certifications.', status: 'completed', icon: Trophy },
  { id: 6, year: '2026', title: 'AI & Cloud', subtitle: 'FastAPI, OpenAI, AWS', desc: 'AI-powered tools, containerization, cloud services.', status: 'future', icon: Rocket },
  { id: 7, year: '2027', title: 'Software Engineer', subtitle: 'Target: Product-Based Company', desc: 'Scalable web & AI product engineering.', status: 'future', icon: Target }
];

const CareerRoadSection = ({ careerNodes = [] }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const roadNodes = careerNodes.length > 0
    ? careerNodes.map((node, idx) => ({
        id: node._id || idx,
        year: node.year,
        title: node.title,
        subtitle: node.subtitle,
        desc: node.description,
        status: node.status || 'future',
        icon: iconMap[node.icon] || Target
      }))
    : defaultNodes;

  const totalCards = roadNodes.length;

  const handleNextCard = () => {
    setActiveCardIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrevCard = () => {
    setActiveCardIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  return (
    <section id="career-road" className="py-20 relative w-full border-t border-slate-200 dark:border-zinc-800/60">
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
              05.1 // TIMELINE
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1"
            >
              Engineering Progression Roadmap
            </motion.h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
              className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-white/50"
            >
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" /> Done</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Active</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-zinc-700" /> Upcoming</span>
            </motion.div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>VIEW FULL ROADMAP</span>
            </button>
          </div>
        </div>

        {/* Desktop / Laptop View: Clean Vertical Timeline (as before) */}
        <div className="hidden sm:block relative max-w-3xl mx-auto">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, ease: easeCurve }}
            className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-emerald-500 to-slate-200 dark:to-zinc-800 origin-top"
          />

          <div className="space-y-6">
            {roadNodes.map((node, idx) => {
              const IconComp = node.icon || Target;
              const isActive = node.status === 'active';
              const isCompleted = node.status === 'completed';

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -15, y: 15 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: easeCurve }}
                  className="relative flex items-start gap-6 group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border z-10 shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                    isActive ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400' :
                    isCompleted ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400' :
                    'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-600'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>

                  <div className="editorial-card p-5 flex-1 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{node.year}</span>
                      {isActive && <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold">● ACTIVE</span>}
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{node.title}</h4>
                    <p className="text-xs font-mono text-slate-600 dark:text-white/50 mt-0.5">{node.subtitle}</p>
                    <p className="text-xs text-slate-700 dark:text-white/70 mt-2 leading-relaxed">{node.desc || node.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile View: Interactive Mobile Deck / Card Stack (sm:hidden) */}
        <div className="block sm:hidden relative max-w-xl mx-auto min-h-[300px] flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[4/3] max-h-[280px]">
            {roadNodes.map((node, idx) => {
              const offset = (idx - activeCardIndex + totalCards) % totalCards;
              if (offset >= 3) return null;

              const IconComp = node.icon || Target;
              const isCompleted = node.status === 'completed';
              const isActive = node.status === 'active';

              const scale = 1 - offset * 0.05;
              const translateY = offset * 12;
              const zIndex = totalCards - offset;

              return (
                <motion.div
                  key={node.id}
                  onClick={() => setActiveCardIndex(idx)}
                  animate={{ scale, y: translateY }}
                  transition={{ duration: 0.3, ease: easeCurve }}
                  style={{ zIndex }}
                  className={`absolute inset-0 rounded-2xl p-5 cursor-pointer shadow-lg border backdrop-blur-md flex flex-col justify-between select-none ${
                    offset === 0
                      ? 'bg-white dark:bg-zinc-900 border-indigo-500/50'
                      : 'bg-slate-50/90 dark:bg-zinc-950/90 border-slate-200 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        isCompleted ? 'bg-indigo-500/10 text-indigo-500' :
                        isActive ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-slate-200 dark:bg-zinc-800 text-slate-400'
                      }`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {node.year}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                      {node.status}
                    </span>
                  </div>

                  <div className="space-y-1 my-auto">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {node.title}
                    </h3>
                    <p className="text-xs font-mono text-indigo-500 font-semibold">
                      {node.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-2">
                      {node.desc || node.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Card {activeCardIndex + 1}/{totalCards}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-500 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={handlePrevCard} className="p-2 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-slate-500">{activeCardIndex + 1} / {totalCards}</span>
            <button onClick={handleNextCard} className="p-2 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View More Modal */}
        <CareerRoadDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          nodes={roadNodes}
        />

      </div>
    </section>
  );
};

export default CareerRoadSection;
