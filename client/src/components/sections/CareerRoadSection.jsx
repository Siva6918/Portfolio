import React, { useState } from 'react';
import { GraduationCap, Cpu, Code2, FlaskConical, Briefcase, Rocket, Trophy, Target, Layers, ArrowRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const topCard = roadNodes[activeCardIndex];
  const TopIcon = topCard?.icon || Target;

  return (
    <section id="career-road" className="py-20 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
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
              05.1 // DECK OF CARDS TIMELINE
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1"
            >
              Engineering Progression Stack
            </motion.h2>
          </div>

          <div className="flex items-center gap-3">
            {/* View More Modal Trigger Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>VIEW FULL ROADMAP ({totalCards})</span>
            </button>
          </div>
        </div>

        {/* 3D Stacked Deck of Cards Visualization */}
        <div className="relative max-w-xl mx-auto min-h-[340px] flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[4/3.1] sm:aspect-[4/2.5] max-h-[300px]">
            {roadNodes.map((node, idx) => {
              // Calculate relative stack offset from active card
              const offset = (idx - activeCardIndex + totalCards) % totalCards;
              const isVisible = offset < 4; // Show top 4 cards in stack
              if (!isVisible) return null;

              const IconComp = node.icon || Target;
              const isCompleted = node.status === 'completed';
              const isActive = node.status === 'active';

              // Visual stacking math
              const scale = 1 - offset * 0.05;
              const translateY = offset * 14;
              const rotate = offset * 2.5 * (idx % 2 === 0 ? 1 : -1);
              const zIndex = totalCards - offset;
              const opacity = 1 - offset * 0.2;

              return (
                <motion.div
                  key={node.id}
                  onClick={() => setActiveCardIndex(idx)}
                  animate={{
                    scale,
                    y: translateY,
                    rotate,
                    opacity
                  }}
                  transition={{ duration: 0.4, ease: easeCurve }}
                  style={{ zIndex }}
                  className={`absolute inset-0 rounded-3xl p-6 sm:p-8 cursor-pointer shadow-xl border backdrop-blur-md flex flex-col justify-between select-none ${
                    offset === 0
                      ? 'bg-white dark:bg-zinc-900 border-indigo-500/50 shadow-indigo-500/10'
                      : 'bg-slate-50/90 dark:bg-zinc-950/90 border-slate-200 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2.5 rounded-xl ${
                        isCompleted ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20' :
                        isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        'bg-slate-200 dark:bg-zinc-800 text-slate-500'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-zinc-700">
                        {node.year}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isCompleted ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30' :
                      isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse' :
                      'bg-slate-200 dark:bg-zinc-800 text-slate-500'
                    }`}>
                      {node.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 my-auto">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {node.title}
                    </h3>
                    <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                      {node.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                      {node.desc || node.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 dark:text-zinc-500">
                      Card {activeCardIndex + 1} of {totalCards}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Deck Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrevCard}
              className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-md"
              aria-label="Previous Card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="font-mono text-xs text-slate-500 dark:text-zinc-400">
              {activeCardIndex + 1} / {totalCards}
            </span>

            <button
              onClick={handleNextCard}
              className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-md"
              aria-label="Next Card"
            >
              <ChevronRight className="w-5 h-5" />
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
