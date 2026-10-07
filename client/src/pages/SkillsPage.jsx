import React, { useEffect, useState } from 'react';
import { getSkills, resolveMediaUrl } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import RevealOnScroll from '../components/common/RevealOnScroll';

import { Search } from 'lucide-react';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = "Skills | Venkata Siva Reddy";
    window.scrollTo(0, 0);

    const cached = localStorage.getItem('siva_skills');
    if (cached) {
      setSkills(JSON.parse(cached));
      setLoading(false);
    }
    
    getSkills().then(res => {
      if (res.data && res.data.data) {
        setSkills(res.data.data);
        localStorage.setItem('siva_skills', JSON.stringify(res.data.data));
      }
      setLoading(false);
    });
  }, []);

  if (loading && skills.length === 0) {
    return <div className="section-container"><SkeletonLoader count={3} /></div>;
  }

  const filteredSkills = skills.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase())));

  // Group skills by category
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="section-container pt-32">
      <RevealOnScroll className="animate-fade-up">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 font-grotesk text-white">Skills & Arsenal</h1>
        
        <div className="relative max-w-md mb-16">
          <input
            type="text"
            placeholder="Search skills by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-editorial-border text-editorial-textMain p-4 pl-12 font-mono text-sm rounded-xl focus:outline-none focus:border-editorial-accent transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-editorial-textMuted" />
        </div>
      </RevealOnScroll>
      
      <div className="space-y-24">
        {Object.entries(groupedSkills).map(([category, catSkills], index) => (
          <RevealOnScroll key={category} delay={100} className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            <h2 className="font-mono text-sm text-editorial-accent uppercase tracking-widest pt-4 border-t border-editorial-border md:border-none md:pt-2">
              {category}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catSkills.map((skill, sIdx) => (
                <div key={skill._id} className={`group flex items-center gap-4 border border-editorial-border bg-[#121212] p-4 rounded-xl hover:border-editorial-textMuted transition-colors interactive-lift animate-fade-up delay-${(sIdx+1)*100}`}>
                  {skill.logo ? (
                    <img src={resolveMediaUrl(skill.logo)} alt={skill.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <div className="w-8 h-8 rounded-md bg-editorial-surface border border-editorial-border flex items-center justify-center font-mono text-[10px] text-editorial-textMuted">
                      {skill.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="font-grotesk font-bold text-white block">{skill.name}</span>
                    {skill.proficiency && (
                      <span className="font-mono text-[10px] text-editorial-textMuted uppercase">{skill.proficiency}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        ))}

        {skills.length === 0 && (
          <div className="text-editorial-textMuted font-mono text-sm uppercase tracking-widest py-8">
            No skills data currently available.
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;
