import React from 'react';
import { GraduationCap, Cpu, Code2, FlaskConical, Briefcase, Rocket, Trophy, Target } from 'lucide-react';
import { motion } from 'framer-motion';

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

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
            className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-white/50"
          >
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" /> Done</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Active</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-zinc-700" /> Upcoming</span>
          </motion.div>
        </div>

        {/* Vertical Timeline with Expanding Line */}
        <div className="relative max-w-3xl mx-auto">
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
                    <p className="text-xs text-slate-700 dark:text-white/70 mt-2 leading-relaxed">{node.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CareerRoadSection;
