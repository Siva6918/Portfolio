import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';

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
    <div className="section-container animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold mb-12">What I'm doing now</h1>
      
      <div className="space-y-12 max-w-2xl text-editorial-textMain text-lg leading-relaxed">
        <section>
          <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-4 border-b border-editorial-border pb-2">Currently Building</h2>
          <p>{profile?.nowCurrentlyBuilding || 'A personal web application redesign'}</p>
        </section>

        <section>
          <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-4 border-b border-editorial-border pb-2">Learning</h2>
          <p>{profile?.nowLearning || 'Go, microservices architecture, and cloud deployment'}</p>
        </section>

        <section>
          <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-4 border-b border-editorial-border pb-2">Exploring</h2>
          <p>{profile?.nowExploring || 'Building autonomous AI agents'}</p>
        </section>

        <section>
          <h2 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-4 border-b border-editorial-border pb-2">Up Next</h2>
          <p>{profile?.nowNext || 'Landing a high-impact internship'}</p>
        </section>
      </div>

      <div className="mt-20 pt-8 border-t border-editorial-border">
        <p className="text-sm text-editorial-textMuted font-mono">Inspired by Derek Sivers' /now page movement.</p>
      </div>
    </div>
  );
};

export default NowPage;
