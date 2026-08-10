import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveMediaUrl } from '../../services/api';

const easeCurve = [0.16, 1, 0.3, 1];

const defaultSkillsFallback = [
  // Languages
  { name: 'Java', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs' },
  { name: 'JavaScript', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs' },
  { name: 'Python', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', proficiency: 'Intermediate', yearsOfExperience: '2+ yrs' },
  { name: 'C++', category: 'Programming Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs' },
  
  // Frontend
  { name: 'React', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs' },
  { name: 'Next.js', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs' },
  { name: 'Tailwind CSS', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs' },

  // Backend
  { name: 'Node.js', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs' },
  { name: 'Express.js', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs' },
  { name: 'FastAPI', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs' },

  // Databases
  { name: 'MongoDB', category: 'Databases', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs' },
  { name: 'MySQL', category: 'Databases', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', proficiency: 'Intermediate', yearsOfExperience: '2+ yrs' },
  { name: 'Redis', category: 'Databases', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs' },

  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud & DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs' },
  { name: 'Docker', category: 'Cloud & DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs' },
  { name: 'Git & GitHub', category: 'Cloud & DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', proficiency: 'Advanced', yearsOfExperience: '2+ yrs' },

  // Core CS
  { name: 'Data Structures & Algorithms', category: 'Core CS', logo: '', proficiency: 'Advanced', yearsOfExperience: '2+ yrs' },
  { name: 'System Design', category: 'Core CS', logo: '', proficiency: 'Intermediate', yearsOfExperience: '1+ yrs' }
];

const SkillsSection = ({ skills = [] }) => {
  const activeSkillsList = skills.length > 0 ? skills : defaultSkillsFallback;
  
  const categoryNames = ['All', 'Programming Languages', 'Frontend', 'Backend', 'Databases', 'Cloud & DevOps', 'Core CS'];
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSkills = activeSkillsList.filter((s) => {
    const matchesCat = selectedCat === 'All' || s.category === selectedCat;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="skills" className="py-20 relative w-full border-t border-slate-200 dark:border-zinc-800/60">
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
              04 // STACK & COMPETENCIES
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1"
            >
              Technical Architecture & Tools
            </motion.h2>
          </div>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
            className="relative w-full sm:w-72"
          >
            <Search className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter technologies..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-sm transition-colors duration-200"
            />
          </motion.div>
        </div>

        {/* Category Tabs with 80ms Stagger */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {categoryNames.map((cat, idx) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: easeCurve }}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl font-mono text-xs whitespace-nowrap transition-all duration-200 active:scale-95 ${
                selectedCat === cat
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white shadow-sm'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Skill Cards Grid with Smooth Motion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, idx) => (
              <motion.div
                key={skill._id || skill.name || idx}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: (idx % 8) * 0.04, ease: easeCurve }}
                className="editorial-card p-5 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-200 group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-center shrink-0 p-2 group-hover:border-indigo-500/30 transition-colors">
                    {skill.logo ? (
                      <img src={resolveMediaUrl(skill.logo)} alt={skill.name} className="w-6 h-6 object-contain" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {skill.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-white/50">
                      {skill.category}
                    </span>
                  </div>
                </div>

                {skill.proficiency && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-white/50">
                    {skill.proficiency}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 font-mono text-xs text-slate-500 dark:text-white/40">
            No technologies match "{searchTerm}".
          </div>
        )}

      </div>
    </section>
  );
};

export default SkillsSection;
