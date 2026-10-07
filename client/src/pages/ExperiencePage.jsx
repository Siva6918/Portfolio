import React, { useEffect, useState } from 'react';
import { getExperience } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';

const ExperiencePage = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Experience | Venkata Siva Reddy";
    window.scrollTo(0, 0);

    const cached = localStorage.getItem('siva_experience');
    if (cached) {
      setExperience(JSON.parse(cached));
      setLoading(false);
    }
    
    getExperience().then(res => {
      if (res.data && res.data.data) {
        setExperience(res.data.data);
        localStorage.setItem('siva_experience', JSON.stringify(res.data.data));
      }
      setLoading(false);
    });
  }, []);

  if (loading && experience.length === 0) {
    return <div className="section-container"><SkeletonLoader count={3} /></div>;
  }

  return (
    <div className="section-container animate-fade-in pt-32">
      <h1 className="text-4xl sm:text-5xl font-bold mb-16 font-grotesk text-white">Experience</h1>
      
      <div className="space-y-16 max-w-4xl border-l border-editorial-border pl-6 sm:pl-10">
        {experience.map((exp, index) => (
          <div key={exp._id || index} className="relative">
            <div className="absolute -left-[29px] sm:-left-[45px] top-1.5 w-2 h-2 rounded-full bg-editorial-accent"></div>
            
            <div className="font-mono text-xs text-editorial-textMuted uppercase tracking-widest mb-2">
              {exp.startDate} — {exp.endDate || 'Present'}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 font-grotesk">{exp.role}</h2>
            <h3 className="text-lg text-editorial-accent font-mono mb-4">{exp.company}</h3>
            
            <div className="text-editorial-textMain text-base sm:text-lg leading-relaxed mb-6 whitespace-pre-wrap">
              {exp.description}
            </div>
            
            {exp.skills && exp.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {exp.skills.map(skill => (
                  <span key={skill._id || skill} className="px-2 py-1 text-xs font-mono text-editorial-textMuted bg-editorial-surface border border-editorial-border uppercase">
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {experience.length === 0 && (
          <div className="text-editorial-textMuted font-mono text-sm uppercase tracking-widest">
            No experience data currently available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencePage;
