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

  const palette = [
    { border: 'border-marigold/30 hover:border-marigold', text: 'text-marigold', bg: 'bg-marigold/10' },
    { border: 'border-neonRose/30 hover:border-neonRose', text: 'text-neonRose', bg: 'bg-neonRose/10' },
    { border: 'border-iceSilver/30 hover:border-iceSilver', text: 'text-iceSilver', bg: 'bg-iceSilver/10' },
    { border: 'border-solarAmber/30 hover:border-solarAmber', text: 'text-solarAmber', bg: 'bg-solarAmber/10' },
    { border: 'border-cyberRose/30 hover:border-cyberRose', text: 'text-cyberRose', bg: 'bg-cyberRose/10' }
  ];

  return (
    <div className="section-container pt-32">
      <RevealOnScroll className="animate-fade-up">
        {/* Tactical Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marigold/10 border border-marigold/30 text-marigold text-xs font-mono mb-4">
          <Trophy className="w-3.5 h-3.5 text-marigold" />
          <span className="tracking-widest uppercase font-bold">TACTICAL VICTORIES // HONORS & RECOGNITION</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-grotesk text-white">
          Honors, Awards &{' '}
          <span className="bg-gradient-to-r from-marigold via-neonRose to-iceSilver bg-clip-text text-transparent">
            Clutch Victories
          </span>
        </h1>
        <p className="text-iceSilver-dark text-base sm:text-lg mb-8 max-w-2xl font-mono">
          Hackathons, competitive algorithmic problem solving, academic excellence, and battle royale esports records.
        </p>
        
        <div className="relative max-w-md mb-16">
          <input
            type="text"
            placeholder="Search achievements or events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101016] border border-[#242834] text-iceSilver p-4 pl-12 font-mono text-sm rounded-xl focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold/30 transition-all placeholder:text-zinc-600"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        </div>
      </RevealOnScroll>
      
      <div className="flex flex-col space-y-16">
        {filteredAchievements.map((ach, index) => {
          const colorMeta = palette[index % palette.length];
          return (
            <RevealOnScroll key={ach._id || index} delay={100} className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-8 py-8 border-b border-[#242834] group">
              <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest pt-1 flex flex-col gap-2">
                <div className={`font-bold ${colorMeta.text}`}>{ach.year}</div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 font-grotesk flex flex-wrap items-center gap-3 group-hover:text-marigold transition-colors">
                    {ach.title}
                    {ach.rank && (
                      <span className={`px-2.5 py-0.5 rounded-sm font-mono text-[11px] font-bold border ${colorMeta.bg} ${colorMeta.text} ${colorMeta.border}`}>
                        {ach.rank}
                      </span>
                    )}
                  </h3>
                  <div className="text-zinc-400 font-mono text-xs uppercase mb-4 tracking-wider">
                    {ach.organization} {ach.event && `• ${ach.event}`}
                  </div>
                  
                  {ach.description && (
                    <p className="text-iceSilver-dark text-base mb-6 max-w-2xl leading-relaxed">{ach.description}</p>
                  )}
                </div>

                {ach.image && (
                  <div className="w-full md:w-64 shrink-0">
                    <a href={resolveMediaUrl(ach.image)} target="_blank" rel="noreferrer" className="block overflow-hidden bg-[#101016] p-2 rounded-xl border border-[#242834] hover:border-marigold transition-all interactive-lift">
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
          );
        })}

        {achievements.length === 0 && (
          <div className="text-zinc-500 font-mono text-sm uppercase tracking-widest py-8">
            No achievements data currently available.
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
