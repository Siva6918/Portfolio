import React, { useEffect, useState } from 'react';
import { getExperience, resolveMediaUrl } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { ExternalLink, Award } from 'lucide-react';

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
    <div className="section-container pt-32">
      <RevealOnScroll className="animate-fade-up">
        <h1 className="text-4xl sm:text-5xl font-bold mb-16 font-grotesk text-white">Experience</h1>
      </RevealOnScroll>
      
      <div className="space-y-24 max-w-4xl border-l border-editorial-border pl-6 sm:pl-10 relative before:absolute before:inset-y-0 before:left-[-1px] before:w-[2px] before:bg-gradient-to-b before:from-editorial-accent before:to-transparent before:animate-[lineReveal_1.5s_ease-out_forwards]">
        {experience.map((exp, index) => (
          <RevealOnScroll key={exp._id || index} delay={100} className="relative group">
            <div className="absolute -left-[29px] sm:-left-[45px] top-1.5 w-2 h-2 rounded-full bg-editorial-accent group-hover:scale-150 transition-transform duration-300 shadow-[0_0_10px_rgba(217,78,52,0.5)]"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div className="font-mono text-xs text-editorial-textMuted uppercase tracking-widest">
                {exp.startDate} — {exp.endDate || 'Present'}
              </div>
              <div className="font-mono text-[10px] text-editorial-accent uppercase border border-editorial-accent/20 bg-editorial-accent/5 px-2 py-0.5 rounded-sm self-start sm:self-auto">
                {exp.mode} {exp.location ? `• ${exp.location}` : ''}
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 font-grotesk">{exp.role}</h2>
            
            <div className="flex items-center gap-3 mb-6">
              {exp.companyLogo && (
                <img src={resolveMediaUrl(exp.companyLogo)} alt={exp.company} className="w-6 h-6 object-contain rounded-sm" />
              )}
              {exp.companyUrl ? (
                <a href={exp.companyUrl} target="_blank" rel="noreferrer" className="text-lg text-editorial-accent font-mono flex items-center gap-1 hover:underline">
                  {exp.company} <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <h3 className="text-lg text-editorial-accent font-mono">{exp.company}</h3>
              )}
            </div>
            
            {exp.description && (
              <div className="text-editorial-textMain text-base sm:text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                {exp.description}
              </div>
            )}

            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <ul className="list-disc pl-5 space-y-2 mb-6 text-editorial-textMain text-base">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            )}
            
            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 mt-6">
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 text-[10px] font-mono text-editorial-textMuted bg-[#121212] border border-editorial-border uppercase rounded-sm hover:border-editorial-textMuted transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              
              {exp.certificate && (
                <a href={exp.certificate} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-mono text-white hover:text-editorial-accent uppercase tracking-widest transition-colors">
                  <Award className="w-4 h-4" /> View Certificate
                </a>
              )}
            </div>
          </RevealOnScroll>
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
