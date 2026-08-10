import React, { useState } from 'react';
import { Search, Sparkles, LayoutGrid, ListFilter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveMediaUrl } from '../../services/api';
import SwipeableCarousel from '../common/SwipeableCarousel';

const easeCurve = [0.16, 1, 0.3, 1];

const defaultSkillsFallback = [
  // Languages
  { name: 'Java', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', proficiency: 'Advanced' },
  { name: 'JavaScript', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', proficiency: 'Advanced' },
  { name: 'Python', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', proficiency: 'Intermediate' },
  { name: 'C++', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', proficiency: 'Intermediate' },
  
  // Frontend
  { name: 'React', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', proficiency: 'Advanced' },
  { name: 'Next.js', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', proficiency: 'Intermediate' },
  { name: 'Tailwind CSS', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', proficiency: 'Advanced' },

  // Backend
  { name: 'Node.js', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', proficiency: 'Advanced' },
  { name: 'Express.js', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', proficiency: 'Advanced' },
  { name: 'FastAPI', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', proficiency: 'Intermediate' },

  // Databases
  { name: 'MongoDB', category: 'Databases', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', proficiency: 'Advanced' },
  { name: 'MySQL', category: 'Databases', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', proficiency: 'Intermediate' },
  { name: 'Redis', category: 'Databases', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', proficiency: 'Intermediate' },

  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud & DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', proficiency: 'Intermediate' },
  { name: 'Docker', category: 'Cloud & DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', proficiency: 'Intermediate' },
  { name: 'Git & GitHub', category: 'Cloud & DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', proficiency: 'Advanced' },

  // Core CS
  { name: 'Data Structures & Algorithms', category: 'Core CS', logo: '', proficiency: 'Advanced' },
  { name: 'System Design', category: 'Core CS', logo: '', proficiency: 'Intermediate' }
];

const SkillsSection = ({ skills = [] }) => {
  const activeSkillsList = skills.length > 0 ? skills : defaultSkillsFallback;
  
  const categoryNames = ['All', 'Programming Languages', 'Frontend', 'Backend', 'Databases', 'Cloud & DevOps', 'Core CS'];
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('compact'); // 'compact' or 'grid'

  const filteredSkills = activeSkillsList.filter((s) => {
    const matchesCat = selectedCat === 'All' || s.category === selectedCat;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Group skills by category for compact pillar view
  const categoriesGrouped = categoryNames
    .filter((c) => c !== 'All')
    .map((cat) => ({
      category: cat,
      items: activeSkillsList.filter((s) => s.category === cat && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }))
    .filter((g) => g.items.length > 0);

  return (
    <section id="skills" className="py-16 relative w-full border-t border-slate-200 dark:border-zinc-800/60">
      <div className="section-container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-semibold block">
              04 // STACK & COMPETENCIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              Skills & Tech Stack
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 font-mono text-xs">
              <button
                onClick={() => setViewMode('compact')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'compact'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Sleek View</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter skill..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* 1. SLEEK COMPACT PILLAR VIEW (Default - Sleek, non-bulky layout) */}
        {viewMode === 'compact' && (
          <>
            {/* Desktop & Tablet Compact Grid */}
            <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriesGrouped.map((group) => (
                <div
                  key={group.category}
                  className="editorial-card p-5 space-y-3.5 hover:border-indigo-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-2">
                    <h3 className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {group.category}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      {group.items.length} skills
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <div
                        key={skill.name}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/40 hover:bg-indigo-500/10 text-xs font-semibold text-slate-800 dark:text-zinc-200 transition-all duration-200 group"
                      >
                        {skill.logo ? (
                          <img src={resolveMediaUrl(skill.logo)} alt={skill.name} className="w-4 h-4 object-contain" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        )}
                        <span>{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View Swipe Carousel for Compact View (sm:hidden) */}
            <div className="block sm:hidden">
              <SwipeableCarousel showDots={true}>
                {categoriesGrouped.map((group) => (
                  <div key={group.category} className="editorial-card p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <h3 className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {group.category}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">{group.items.length} items</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {group.items.map((skill) => (
                        <div
                          key={skill.name}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-800 dark:text-zinc-200"
                        >
                          {skill.logo ? (
                            <img src={resolveMediaUrl(skill.logo)} alt={skill.name} className="w-3.5 h-3.5 object-contain" />
                          ) : (
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                          )}
                          <span>{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </SwipeableCarousel>
            </div>
          </>
        )}

        {/* 2. DETAILED GRID VIEW */}
        {viewMode === 'grid' && (
          <div>
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none mb-6">
              {categoryNames.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all ${
                    selectedCat === cat
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {filteredSkills.map((skill, idx) => (
                <div
                  key={skill._id || skill.name || idx}
                  className="editorial-card p-4 flex items-center justify-between hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-center shrink-0 p-1.5">
                      {skill.logo ? (
                        <img src={resolveMediaUrl(skill.logo)} alt={skill.name} className="w-5 h-5 object-contain" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{skill.name}</h4>
                      <span className="text-[9px] font-mono text-slate-400">{skill.category}</span>
                    </div>
                  </div>

                  {skill.proficiency && (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-950 text-slate-500 border border-slate-200 dark:border-zinc-800">
                      {skill.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default SkillsSection;
