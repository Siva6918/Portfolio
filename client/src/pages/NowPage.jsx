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
        {/* Tactical Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marigold/10 border border-marigold/30 text-marigold text-xs font-mono mb-4">
          <Terminal className="w-3.5 h-3.5 text-marigold" />
          <span className="tracking-widest uppercase font-bold">LIVE TELEMETRY // CURRENT FOCUS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4 font-grotesk text-white">
          Active Focus &{' '}
          <span className="bg-gradient-to-r from-marigold via-neonRose to-iceSilver bg-clip-text text-transparent">
            Telemetry /now
          </span>
        </h1>
        <p className="text-iceSilver-dark text-base sm:text-lg mb-16 font-mono leading-relaxed max-w-2xl">
          Real-time snapshot of current engineering projects, technological explorations, and competitive battle royale rankings.
        </p>
      </RevealOnScroll>
      
      <div className="space-y-8 max-w-2xl text-iceSilver text-lg leading-relaxed">
        <RevealOnScroll delay={100}>
          <section className="bg-[#101016] p-8 rounded-2xl border border-marigold/30 hover:border-marigold transition-all interactive-lift">
            <h2 className="text-xs font-mono text-marigold tracking-widest uppercase mb-3 border-b border-[#242834] pb-2 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-marigold animate-ping" />
              01 // CURRENTLY BUILDING
            </h2>
            <p className="font-grotesk text-xl text-white">{profile?.nowCurrentlyBuilding || 'High-performance interactive developer portfolio & esports telemetry suite'}</p>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <section className="bg-[#101016] p-8 rounded-2xl border border-neonRose/30 hover:border-neonRose transition-all interactive-lift">
            <h2 className="text-xs font-mono text-neonRose tracking-widest uppercase mb-3 border-b border-[#242834] pb-2 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neonRose animate-pulse" />
              02 // LEARNING & OPTIMIZING
            </h2>
            <p className="font-grotesk text-xl text-white">{profile?.nowLearning || 'Go microservices, real-time WebSockets, and low-latency cloud deployments'}</p>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delay={300}>
          <section className="bg-[#101016] p-8 rounded-2xl border border-iceSilver/30 hover:border-iceSilver transition-all interactive-lift">
            <h2 className="text-xs font-mono text-iceSilver tracking-widest uppercase mb-3 border-b border-[#242834] pb-2 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-iceSilver" />
              03 // EXPLORING & EXPERIMENTING
            </h2>
            <p className="font-grotesk text-xl text-white">{profile?.nowExploring || 'Autonomous multi-agent architectures, LLM orchestration, and high-APM gaming telemetry'}</p>
          </section>
        </RevealOnScroll>

        <RevealOnScroll delay={400}>
          <section className="bg-[#101016] p-8 rounded-2xl border border-solarAmber/30 hover:border-solarAmber transition-all interactive-lift">
            <h2 className="text-xs font-mono text-solarAmber tracking-widest uppercase mb-3 border-b border-[#242834] pb-2 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-solarAmber" />
              04 // UP NEXT ON RADAR
            </h2>
            <p className="font-grotesk text-xl text-white">{profile?.nowNext || 'Full-time software engineering roles, hackathon championships, and Grandmaster Free Fire rank'}</p>
          </section>
        </RevealOnScroll>
      </div>

      <RevealOnScroll delay={500} className="mt-16 pt-8 border-t border-[#242834]">
        <p className="text-xs text-zinc-500 font-mono">Inspired by Derek Sivers' <a href="https://nownownow.com/about" target="_blank" rel="noreferrer" className="text-marigold hover:underline">/now page movement</a>.</p>
      </RevealOnScroll>
    </div>
  );
};

export default NowPage;
