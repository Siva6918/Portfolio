import React, { useEffect, useState } from 'react';
import { getAchievements, resolveMediaUrl } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { Trophy, Search } from 'lucide-react';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = "Achievements | Venkata Siva Reddy";
    window.scrollTo(0, 0);

    const cached = localStorage.getItem('siva_achievements');
    if (cached) {
      setAchievements(JSON.parse(cached));
      setLoading(false);
    }
    
    getAchievements().then(res => {
      if (res.data && res.data.data) {
        setAchievements(res.data.data);
        localStorage.setItem('siva_achievements', JSON.stringify(res.data.data));
      }
      setLoading(false);
    });
  }, []);

  if (loading && achievements.length === 0) {
    return <div className="section-container"><SkeletonLoader count={3} /></div>;
  }

  const filteredAchievements = achievements.filter(ach => {
    const searchString = `${ach.title} ${ach.organization} ${ach.event || ''}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="section-container pt-32">
      <RevealOnScroll className="animate-fade-up">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 font-grotesk text-white">Honors & Awards</h1>
        
        <div className="relative max-w-md mb-16">
          <input
            type="text"
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-editorial-border text-editorial-textMain p-4 pl-12 font-mono text-sm rounded-xl focus:outline-none focus:border-editorial-accent transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-editorial-textMuted" />
        </div>
      </RevealOnScroll>
      
      <div className="flex flex-col space-y-16">
        {filteredAchievements.map((ach, index) => (
          <RevealOnScroll key={ach._id || index} delay={100} className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-8 py-8 border-b border-editorial-border group">
            <div className="font-mono text-xs text-editorial-textMuted uppercase tracking-widest pt-1 flex flex-col gap-2">
              <div className="text-editorial-accent">{ach.year}</div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2 font-grotesk flex flex-wrap items-center gap-3">
                  {ach.title}
                  {ach.rank && (
                    <span className="px-2 py-0.5 rounded-sm bg-editorial-accent/10 text-editorial-accent font-mono text-[10px] border border-editorial-accent/20">
                      {ach.rank}
                    </span>
                  )}
                </h3>
                <div className="text-editorial-textMuted font-mono text-xs uppercase mb-4 tracking-wider">
                  {ach.organization} {ach.event && `• ${ach.event}`}
                </div>
                
                {ach.description && (
                  <p className="text-editorial-textMain text-base mb-6 max-w-2xl">{ach.description}</p>
                )}
              </div>

              {ach.image && (
                <div className="w-full md:w-64 shrink-0">
                  <a href={resolveMediaUrl(ach.image)} target="_blank" rel="noreferrer" className="block img-editorial overflow-hidden bg-[#121212] p-2 interactive-lift">
                    <img 
                      src={resolveMediaUrl(ach.image)} 
                      alt={ach.title} 
                      loading="lazy"
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </a>
                </div>
              )}
            </div>
          </RevealOnScroll>
        ))}

        {achievements.length === 0 && (
          <div className="text-editorial-textMuted font-mono text-sm uppercase tracking-widest py-8">
            No achievements data currently available.
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
