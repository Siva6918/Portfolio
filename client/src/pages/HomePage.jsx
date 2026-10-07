import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getProjects } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';

const HomePage = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Venkata Siva Reddy | Full Stack Developer";
    
    const cachedProfile = localStorage.getItem('siva_profile');
    if (cachedProfile) setProfile(JSON.parse(cachedProfile));

    const cachedProjects = localStorage.getItem('siva_projects');
    if (cachedProjects) setProjects(JSON.parse(cachedProjects));
    
    if (cachedProfile && cachedProjects) setLoading(false);

    Promise.allSettled([getProfile(), getProjects()]).then(([profRes, projRes]) => {
      if (profRes.status === 'fulfilled' && profRes.value.data?.data) {
        setProfile(profRes.value.data.data);
        localStorage.setItem('siva_profile', JSON.stringify(profRes.value.data.data));
      }
      if (projRes.status === 'fulfilled' && projRes.value.data?.data) {
        setProjects(projRes.value.data.data);
        localStorage.setItem('siva_projects', JSON.stringify(projRes.value.data.data));
      }
      setLoading(false);
    });
  }, []);

  if (loading && !profile) {
    return <div className="section-container"><SkeletonLoader count={3} /></div>;
  }

  return (
    <div className="section-container animate-fade-in pt-32">
      {/* Editorial Header */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-4xl leading-tight mb-8">
        I am a software engineer building scalable web applications and intelligent AI systems.
      </h1>
      <p className="text-editorial-textMuted font-mono text-sm max-w-2xl leading-relaxed mb-16 uppercase tracking-wider">
        {profile?.role} based in {profile?.location}. {profile?.degree} {profile?.branch} student.
      </p>

      {/* Three Status Lines */}
      <div className="space-y-6 mb-24 border-l pl-6 border-editorial-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-mono text-xs text-editorial-textMuted uppercase w-48">Currently Building:</span>
          <span className="text-editorial-textMain text-sm">{profile?.homeStatusCurrentlyBuilding || 'Agentic AI systems & Scalable web apps'}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-mono text-xs text-editorial-textMuted uppercase w-48">Recently Explored:</span>
          <span className="text-editorial-textMain text-sm">{profile?.homeStatusRecentlyExplored || 'AWS Serverless & Advanced React Patterns'}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-mono text-xs text-editorial-textMuted uppercase w-48">Open To:</span>
          <span className="text-editorial-textMain text-sm">{profile?.homeStatusOpenTo || 'Software Engineering Internships'}</span>
        </div>
      </div>

      {/* Four Clear Paths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-32">
        <Link to="/work" className="btn-secondary text-center group">
          <span className="group-hover:text-editorial-accent transition-colors">Explore my work</span>
        </Link>
        <Link to="/notes" className="btn-secondary text-center group">
          <span className="group-hover:text-editorial-accent transition-colors">Read my notes</span>
        </Link>
        <Link to="/about" className="btn-secondary text-center group">
          <span className="group-hover:text-editorial-accent transition-colors">About me</span>
        </Link>
        <Link to="/resume" className="btn-secondary text-center group">
          <span className="group-hover:text-editorial-accent transition-colors">Resume</span>
        </Link>
      </div>

      <div className="hairline-rule mb-16"></div>

      {/* Compact Project Index */}
      <div>
        <h2 className="text-xs font-mono text-editorial-accent uppercase tracking-widest mb-12">Selected Work Index</h2>
        <div className="flex flex-col">
          {projects.slice(0, 5).map((project, index) => (
            <Link 
              key={project._id || index} 
              to={`/work/${project.slug}`}
              className="group flex flex-col sm:flex-row sm:items-baseline justify-between py-6 border-b border-editorial-border hover:bg-[#1a1a1a] transition-colors -mx-6 px-6"
            >
              <div className="flex items-baseline gap-6">
                <span className="text-editorial-textMuted font-mono text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                <h3 className="text-2xl sm:text-3xl font-grotesk text-white group-hover:text-editorial-accent transition-colors">{project.title}</h3>
              </div>
              <div className="mt-2 sm:mt-0 font-mono text-xs text-editorial-textMuted">
                {project.technologies?.slice(0, 3).join(', ')}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-right">
          <Link to="/work" className="text-editorial-accent text-sm font-mono hover:underline uppercase tracking-wider">
            View All Work →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
