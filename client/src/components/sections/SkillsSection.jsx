import React, { useState } from 'react';
import { Cpu, Search, Sparkles, Brain, Users, MessageSquare, Lightbulb, Workflow, ShieldCheck } from 'lucide-react';

const SkillsSection = ({ skills = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Soft Skills list
  const softSkills = [
    { title: 'Problem Solving & DSA', icon: Brain, desc: 'Algorithmic efficiency & analytical approach' },
    { title: 'Technical Communication', icon: MessageSquare, desc: 'Clear documentation & team alignment' },
    { title: 'Team Collaboration & Git', icon: Users, desc: 'Version control & collaborative workflows' },
    { title: 'Agile & Scrum Principles', icon: Workflow, desc: 'Sprint planning & iterative development' },
    { title: 'Code Review & Testing', icon: ShieldCheck, desc: 'Quality assurance & clean code practices' },
    { title: 'Adaptability & Quick Learning', icon: Lightbulb, desc: 'Rapid adoption of new tech & stacks' },
    { title: 'Systematic Thinking', icon: Cpu, desc: 'Designing scalable & modular systems' },
  ];

  const categories = ['All', ...new Set(skills.map(s => s.category))];

  const filteredSkills = skills.filter(skill => {
    const matchesCat = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="skills" className="py-20 relative w-full bg-transparent">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#18181b] border border-slate-300 dark:border-[#27272a] flex items-center justify-center text-slate-900 dark:text-[#4ade80]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-slate-800 dark:text-[#4ade80]">
                Technical Constellation & Grid
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#fafafa]">
                Skills & Expertise
              </h3>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 dark:text-[#a1a1aa] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search technologies..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-[#18181b] border border-slate-300 dark:border-[#27272a] text-xs text-slate-900 dark:text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            />
          </div>
        </div>

        {/* Technical Constellation Grid (65%) | Soft Skills (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Technical Stack (65% width) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272a] pb-3">
              <h4 className="text-base font-bold text-slate-900 dark:text-[#fafafa] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#4ade80] animate-pulse"></span>
                <span>Technical Constellation (65%)</span>
              </h4>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-[#a1a1aa]">{filteredSkills.length} Technologies</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white dark:bg-[#4ade80]/20 dark:text-[#4ade80] border border-slate-900 dark:border-[#4ade80]/40'
                      : 'bg-slate-100 dark:bg-[#18181b] text-slate-800 dark:text-[#a1a1aa] hover:text-slate-900 dark:hover:text-[#4ade80] border border-slate-300 dark:border-[#27272a]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skill Cards with Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredSkills.map((skill) => {
                const pct = skill.percent ?? 80;
                return (
                  <div
                    key={skill._id || skill.name}
                    className="glass-card px-4 py-3 rounded-2xl border border-slate-200 dark:border-[#27272a] hover:border-[#6366f1]/50 transition-all group"
                  >
                    {/* Header row: logo + name + proficiency */}
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#09090b] p-1.5 flex items-center justify-center shrink-0 border border-slate-300 dark:border-[#27272a]">
                        {skill.logo ? (
                          <img src={skill.logo} alt={skill.name} className="w-6 h-6 object-contain" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-[#6366f1]" />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-[#fafafa] truncate leading-tight">
                          {skill.name}
                        </h5>
                        <span className="text-[10px] text-[#a1a1aa] font-mono block truncate">
                          {skill.category}
                        </span>
                      </div>
                      <span className="text-xs font-black font-mono text-[#6366f1] shrink-0">
                        {pct}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#27272a] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#c084fc] transition-all duration-700"
                        style={{ width: pct + '%' }}
                      />
                    </div>

                    {/* Proficiency tag */}
                    <div className="mt-1.5 flex justify-end">
                      <span className="text-[9px] font-mono font-bold text-[#a1a1aa] uppercase tracking-wider">
                        {skill.proficiency || 'Intermediate'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredSkills.length === 0 && (
              <div className="text-center py-8 glass-card rounded-xl text-slate-700 dark:text-[#a1a1aa] text-xs font-semibold">
                No matching skills found for "{searchTerm}".
              </div>
            )}
          </div>

          {/* Right Column - Soft Skills & Practices (35% width) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="border-b border-slate-200 dark:border-[#27272a] pb-3">
              <h4 className="text-base font-bold text-slate-900 dark:text-[#fafafa] flex items-center gap-2">
                <Brain className="w-4 h-4 text-sky-600 dark:text-[#38bdf8]" />
                <span>Soft Skills & Practices (35%)</span>
              </h4>
            </div>

            <div className="space-y-3">
              {softSkills.map((soft) => {
                const IconComponent = soft.icon;
                return (
                  <div
                    key={soft.title}
                    className="glass-card p-3.5 rounded-xl border border-slate-200 dark:border-[#27272a] hover:border-sky-500 dark:hover:border-[#38bdf8]/40 transition-all flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 dark:bg-[#38bdf8]/10 border border-sky-500/20 text-sky-600 dark:text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-[#fafafa]">
                        {soft.title}
                      </h5>
                      <p className="text-[10px] text-slate-700 dark:text-[#a1a1aa] leading-snug mt-0.5 font-medium">
                        {soft.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default SkillsSection;
