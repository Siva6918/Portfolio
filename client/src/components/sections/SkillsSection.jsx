import React, { useState } from 'react';
import { 
  Cpu, Search, Sparkles, Brain, MessageSquare, 
  Users, Workflow, ShieldCheck, Lightbulb 
} from 'lucide-react';
import { resolveMediaUrl } from '../../services/api';

const defaultSoftSkills = [
  { title: 'Problem Solving & DSA', icon: Brain, desc: 'Algorithmic efficiency & analytical thinking' },
  { title: 'Technical Communication', icon: MessageSquare, desc: 'Clear documentation & team alignment' },
  { title: 'Team Collaboration & Git', icon: Users, desc: 'Version control & collaborative workflows' },
  { title: 'Agile & Scrum Principles', icon: Workflow, desc: 'Sprint planning & iterative development' },
  { title: 'Code Review & Testing', icon: ShieldCheck, desc: 'Quality assurance & clean code practices' },
  { title: 'Adaptability & Quick Learning', icon: Lightbulb, desc: 'Rapid adoption of new tech & stacks' },
];

const SkillsSection = ({ skills = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to test if a skill is soft
  const isSoftSkill = (s) => s.type === 'soft' || (s.category && s.category.toLowerCase().includes('soft'));

  // Split technical vs soft skills
  const technicalSkills = skills.filter(s => !isSoftSkill(s));
  const databaseSoftSkills = skills.filter(s => isSoftSkill(s));

  // Distinct technical categories
  const categories = ['All', ...new Set(technicalSkills.map(s => s.category).filter(Boolean))];

  const filteredTechSkills = technicalSkills.filter(skill => {
    const matchesCat = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="skills" className="py-16 relative w-full">
      <div className="section-container">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[#10b981]">
              <Cpu className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-xs uppercase font-mono font-semibold tracking-widest text-[#6ee7b7]">
                Tech Stack & Competencies
              </h2>
              <h3 className="text-2xl font-bold text-[#fafafa]">
                Skills & Technologies
              </h3>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#52525b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skills..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#18181b] border border-[#27272a] text-sm text-[#fafafa] focus:outline-none focus:border-[#3f3f46] placeholder:text-[#52525b]"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 scrollbar-none mb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#6366f1]/15 text-[#a5b4fc] border border-[#6366f1]/30'
                  : 'text-[#71717a] hover:text-[#a1a1aa] border border-transparent hover:border-[#27272a]'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs font-mono text-[#52525b] shrink-0 pl-3">
            {filteredTechSkills.length} skills
          </span>
        </div>

        {/* Skills Grid — Technical Stack */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
          {filteredTechSkills.map((skill) => (
            <div
              key={skill._id || skill.name}
              className="glass-card px-3.5 py-3 rounded-xl flex items-center gap-2.5 group hover:border-[#6366f1]/30 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0a0a0c] p-1.5 flex items-center justify-center shrink-0 border border-[#27272a]">
                {skill.logo ? (
                  <img src={resolveMediaUrl(skill.logo)} alt={skill.name} className="w-5 h-5 object-contain" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#6366f1]" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#e4e4e7] group-hover:text-[#fafafa] truncate block transition-colors">
                  {skill.name}
                </span>
                <span className="text-[10px] text-[#52525b] font-mono truncate block">
                  {skill.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredTechSkills.length === 0 && (
          <div className="text-center py-12 text-sm text-[#52525b]">
            No technical skills found for "{searchTerm}".
          </div>
        )}

        {/* Soft Skills & Professional Practices Section */}
        <div className="mt-10 pt-8 border-t border-[#27272a]">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-[#38bdf8]" />
            <h4 className="text-base font-bold text-[#fafafa]">Soft Skills & Engineering Practices</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {databaseSoftSkills.length > 0 ? (
              databaseSoftSkills.map((soft) => (
                <div
                  key={soft._id || soft.name}
                  className="glass-card p-4 rounded-xl flex items-start gap-3 group hover:border-[#38bdf8]/30 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5">
                    {soft.logo ? (
                      <img src={resolveMediaUrl(soft.logo)} alt={soft.name} className="w-4 h-4 object-contain" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#fafafa] group-hover:text-[#38bdf8] transition-colors">
                      {soft.name}
                    </h5>
                    <p className="text-[11px] text-[#71717a] mt-0.5 leading-snug">
                      {soft.description || soft.category || 'Professional Competency'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              defaultSoftSkills.map((soft) => {
                const IconComp = soft.icon;
                return (
                  <div
                    key={soft.title}
                    className="glass-card p-4 rounded-xl flex items-start gap-3 group hover:border-[#38bdf8]/30 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center shrink-0 mt-0.5">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#fafafa] group-hover:text-[#38bdf8] transition-colors">
                        {soft.title}
                      </h5>
                      <p className="text-[11px] text-[#71717a] mt-0.5 leading-snug">
                        {soft.desc}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;
