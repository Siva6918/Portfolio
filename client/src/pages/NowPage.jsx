import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { Terminal } from 'lucide-react';

const NowPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Now | Venkata Siva Reddy";
    window.scrollTo(0, 0);
    
    // Cached version for speed
    const cached = localStorage.getItem('siva_profile');
    if (cached) {
      setProfile(JSON.parse(cached));
      setLoading(false);
    }
    
    getProfile().then(res => {
      if (res.data && res.data.data) {
        setProfile(res.data.data);
        localStorage.setItem('siva_profile', JSON.stringify(res.data.data));
      }
      setLoading(false);
    });
  }, []);

  if (loading && !profile) {
    return (
      <div className="section-container">
        <SkeletonLoader count={3} />
      </div>
    );
  }

  return (
    <div className="section-container pt-32">
      <RevealOnScroll className="animate-fade-up">
        <h1 className="text-4xl sm:text-5xl font-bold mb-16 font-grotesk text-white flex items-center gap-4">
          <Terminal className="w-8 h-8 text-editorial-accent" /> What I'm doing /now
        </h1>
      </RevealOnScroll>
      
      <div className="space-y-16 max-w-2xl text-editorial-textMain text-lg leading-relaxed">
        <RevealOnScroll delay={100}>
          <section className="bg-[#121212] p-8 rounded-xl border border-editorial-border hover:border-editorial-textMuted transition-colors interactive-lift">
            <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-4 border-b border-editorial-border pb-2">Currently Building</h2>
            <p className="font-grotesk text-xl text-white">{profile?.nowCurrentlyBuilding || 'A personal web application redesign'}</p>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <section className="bg-[#121212] p-8 rounded-xl border border-editorial-border hover:border-editorial-textMuted transition-colors interactive-lift">
            <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-4 border-b border-editorial-border pb-2">Learning</h2>
            <p className="font-grotesk text-xl text-white">{profile?.nowLearning || 'Go, microservices architecture, and cloud deployment'}</p>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delay={300}>
          <section className="bg-[#121212] p-8 rounded-xl border border-editorial-border hover:border-editorial-textMuted transition-colors interactive-lift">
            <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-4 border-b border-editorial-border pb-2">Exploring</h2>
            <p className="font-grotesk text-xl text-white">{profile?.nowExploring || 'Building autonomous AI agents'}</p>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delay={400}>
          <section className="bg-[#121212] p-8 rounded-xl border border-editorial-border hover:border-editorial-textMuted transition-colors interactive-lift">
            <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-4 border-b border-editorial-border pb-2">Up Next</h2>
            <p className="font-grotesk text-xl text-white">{profile?.nowNext || 'Landing a high-impact internship'}</p>
          </section>
        </RevealOnScroll>
      </div>

      <RevealOnScroll delay={500} className="mt-20 pt-8 border-t border-editorial-border">
        <p className="text-sm text-editorial-textMuted font-mono">Inspired by Derek Sivers' <a href="https://nownownow.com/about" target="_blank" rel="noreferrer" className="text-editorial-accent hover:underline">/now page movement</a>.</p>
      </RevealOnScroll>
    </div>
  );
};

export default NowPage;
