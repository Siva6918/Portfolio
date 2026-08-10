import React, { useState } from 'react';
import { Briefcase, ExternalLink, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import SwipeableCarousel from '../common/SwipeableCarousel';

const easeCurve = [0.16, 1, 0.3, 1];

const defaultExperienceFallback = [
  {
    _id: '1',
    role: 'AWS AI-ML Virtual Intern',
    company: 'AWS Academy / EduSkills',
    startDate: '2025',
    endDate: '2025',
    type: 'Internship',
    description: 'Worked with cloud architecture, EC2, S3, IAM security, and AWS SageMaker/AI services to deploy machine learning workflows.',
    technologies: ['AWS S3', 'EC2', 'IAM', 'Python', 'Machine Learning']
  },
  {
    _id: '2',
    role: 'Full Stack Web Developer',
    company: 'Academic & Open Source Projects',
    startDate: '2023',
    endDate: 'Present',
    type: 'Projects',
    description: 'Built multiple production-grade MERN stack web applications (NutriCloud Monitor, DocSpot, Candidate Rank System) featuring JWT auth, socket notifications, and NLP integrations.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Tailwind CSS']
  }
];

const defaultCodingProfilesFallback = [
  { platform: 'LeetCode', problemsSolved: '300+', rating: '1650', rank: 'Top 25%', profileUrl: 'https://leetcode.com/vasanreddy' },
  { platform: 'HackerRank', problemsSolved: '100+', rating: '5 Star Problem Solving', rank: '', profileUrl: 'https://hackerrank.com/vasanreddy' },
  { platform: 'GeeksforGeeks', problemsSolved: '80+', rating: 'CS Fundamentals', rank: '', profileUrl: 'https://geeksforgeeks.org/user/vasanreddy' }
];

const ExperienceSection = ({ experience = [], codingProfiles = [] }) => {
  const activeExp = experience.length > 0 ? experience : defaultExperienceFallback;
  const activeProfiles = codingProfiles.length > 0 ? codingProfiles : defaultCodingProfilesFallback;
  const [expandedId, setExpandedId] = useState(activeExp[0]?._id || '1');

  return (
    <section id="experience" className="py-20 relative w-full border-t border-slate-200 dark:border-zinc-800/60">
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
              05 // EXPERIENCE & PROFILES
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1"
            >
              Internships & Problem Solving
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
            className="text-xs font-mono text-slate-600 dark:text-white/50 max-w-xs"
          >
            Practical engineering experience and competitive coding achievements.
          </motion.p>
        </div>

        {/* Mobile View Swipe Carousel (lg:hidden) */}
        <div className="block lg:hidden space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>ROLES & INTERNSHIPS</span>
            </h3>
            <SwipeableCarousel showDots={true}>
              {activeExp.map((exp) => (
                <div key={exp._id || exp.role} className="editorial-card p-5 space-y-3">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{exp.startDate} — {exp.endDate || 'Present'}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400">{exp.type || 'Role'}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {exp.role} <span className="text-slate-500 font-normal">@ {exp.company}</span>
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                    {exp.description}
                  </p>
                  {exp.technologies && (
                    <div className="flex flex-wrap gap-1 font-mono text-[9px] pt-1">
                      {exp.technologies.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </SwipeableCarousel>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>CODING PROFILES</span>
            </h3>
            <SwipeableCarousel showDots={true}>
              {activeProfiles.map((p) => (
                <div key={p.platform} className="editorial-card p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{p.platform}</span>
                      {p.profileUrl && (
                        <a href={p.profileUrl} target="_blank" rel="noreferrer" className="text-indigo-500">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </h4>
                    <p className="text-xs font-mono text-slate-600 dark:text-zinc-400 mt-1">
                      {p.problemsSolved} Problems Solved · {p.rating}
                    </p>
                  </div>
                </div>
              ))}
            </SwipeableCarousel>
          </div>
        </div>

        {/* Desktop 2 Column View (hidden on mobile/tablet lg:grid) */}
        <div className="hidden lg:grid grid-cols-12 gap-8">
          
          {/* Left: Experience Timeline */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-mono text-slate-600 dark:text-white/50 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>INTERNSHIPS & ROLES</span>
            </h3>

            <div className="space-y-4">
              {activeExp.map((exp, idx) => {
                const isExpanded = expandedId === exp._id;

                return (
                  <motion.div
                    key={exp._id || exp.role}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: easeCurve }}
                    className="editorial-card p-6 cursor-pointer hover:border-indigo-300 dark:hover:border-zinc-700 transition-all duration-200"
                    onClick={() => setExpandedId(isExpanded ? null : exp._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                          {exp.startDate} — {exp.endDate || 'Present'} · [{exp.type || 'Role'}]
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {exp.role} <span className="text-slate-500 dark:text-white/50 font-normal">@ {exp.company}</span>
                        </h4>
                      </div>

                      <button className="p-1 text-slate-400 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: easeCurve }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800/80 space-y-3">
                            <p className="text-xs text-slate-700 dark:text-white/70 leading-relaxed">
                              {exp.description}
                            </p>

                            {exp.technologies && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {exp.technologies.map((tech) => (
                                  <span key={tech} className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-950 text-[10px] font-mono text-slate-600 dark:text-white/50 border border-slate-200 dark:border-zinc-800">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Coding Profiles */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-mono text-slate-600 dark:text-white/50 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>COMPETITIVE CODING PROFILES</span>
            </h3>

            <div className="space-y-4">
              {activeProfiles.map((p, idx) => (
                <motion.div
                  key={p.platform}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: easeCurve }}
                  className="editorial-card p-5 flex items-center justify-between hover:-translate-y-1 transition-all duration-200"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{p.platform}</span>
                      {p.profileUrl && (
                        <a href={p.profileUrl} target="_blank" rel="noreferrer" className="text-slate-400 dark:text-white/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </h4>
                    <p className="text-xs font-mono text-slate-600 dark:text-white/50 mt-1">
                      {p.problemsSolved} Problems Solved · {p.rating}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                    Active
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
