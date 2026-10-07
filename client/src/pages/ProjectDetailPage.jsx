import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectBySlug, resolveMediaUrl } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { ExternalLink, Github } from 'lucide-react';

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getProjectBySlug(slug).then(res => {
      if (res.data && res.data.data) {
        setProject(res.data.data);
        document.title = `${res.data.data.title} | Work`;
      } else {
        setError('Project not found');
      }
      setLoading(false);
    }).catch(err => {
      setError('Failed to load project details');
      setLoading(false);
    });
  }, [slug]);

  // Handle auto-advancing carousel
  useEffect(() => {
    if (!project) return;
    const allImages = [project.thumbnail, ...(project.screenshots || [])].filter(Boolean);
    if (allImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIdx(prev => (prev + 1) % allImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [project]);

  if (loading) return <div className="section-container"><SkeletonLoader count={1} /></div>;
  if (error || !project) return <div className="section-container text-editorial-textMain">{error}</div>;

  const EditorialSection = ({ title, content }) => {
    if (!content) return null;
    return (
      <RevealOnScroll className="mb-16">
        <h3 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-4 border-b border-editorial-border pb-2">{title}</h3>
        <div className="text-editorial-textMain text-lg leading-relaxed whitespace-pre-wrap">{content}</div>
      </RevealOnScroll>
    );
  };

  return (
    <div className="section-container animate-fade-in pt-32">
      <Link to="/work" className="text-editorial-textMuted font-mono text-xs uppercase hover:text-editorial-accent tracking-widest mb-12 inline-block transition-colors">
        ← Back to Work
      </Link>

      <div className="mb-16 space-y-6 animate-fade-up">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-editorial-textMuted uppercase tracking-widest">
          <span>{project.category}</span>
          {project.status && (
            <>
              <span className="w-1 h-1 bg-editorial-border rounded-full"></span>
              <span>{project.status}</span>
            </>
          )}
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold font-grotesk text-white leading-tight">
          {project.title}
        </h1>
        <p className="text-xl sm:text-2xl text-editorial-textMuted max-w-3xl leading-relaxed">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-4">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-editorial-accent hover:text-editorial-accentHover font-mono text-sm uppercase tracking-wider transition-colors">
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          )}
          {project.repositoryUrl && (
            <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-editorial-textMain hover:text-white font-mono text-sm uppercase tracking-wider transition-colors">
              <Github className="w-4 h-4" /> Source Code
            </a>
          )}
        </div>
      </div>

      {(() => {
        const allImages = project.thumbnail ? [project.thumbnail, ...(project.screenshots || [])].filter(Boolean) : [];
        if (allImages.length === 0) return null;
        
        return (
          <RevealOnScroll delay={100} className="mb-20 w-full max-w-5xl mx-auto relative group overflow-hidden rounded-xl border border-editorial-border">
            <div className="flex transition-transform duration-1000 ease-in-out h-full" style={{ transform: `translateX(-${currentImageIdx * 100}%)` }}>
              {allImages.map((img, idx) => (
                <div key={idx} className="w-full shrink-0 aspect-video bg-[#121212]">
                  <img 
                    src={resolveMediaUrl(img)} 
                    alt={`${project.title} - ${idx + 1}`} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02]" 
                  />
                </div>
              ))}
            </div>
            
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${currentImageIdx === idx ? 'w-6 bg-editorial-accent' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </RevealOnScroll>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <EditorialSection title="Problem Statement" content={project.problem || project.description} />
          <EditorialSection title="Architecture & Solution" content={project.solution} />
          <EditorialSection title="Results & Impact" content={project.results} />
          <EditorialSection title="Challenges & Learnings" content={project.learnings} />

          {project.features && project.features.length > 0 && (
            <RevealOnScroll className="mb-16">
              <h3 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-4 border-b border-editorial-border pb-2">Key Features</h3>
              <ul className="list-decimal pl-5 space-y-3 text-editorial-textMain text-lg">
                {project.features.map(f => <li key={f} className="pl-2">{f}</li>)}
              </ul>
            </RevealOnScroll>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-12">
            {project.technologies && project.technologies.length > 0 && (
              <RevealOnScroll>
                <h4 className="text-xs font-mono text-editorial-textMuted tracking-widest uppercase mb-4">Technology Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="px-3 py-1.5 rounded-md text-xs font-mono text-editorial-textMain bg-[#121212] border border-editorial-border hover:border-editorial-textMuted transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </RevealOnScroll>
            )}
            
            {project.skills && project.skills.length > 0 && (
              <RevealOnScroll delay={100}>
                <h4 className="text-xs font-mono text-editorial-textMuted tracking-widest uppercase mb-4">Applied Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map(s => (
                    <span key={s._id} className="px-3 py-1.5 rounded-md text-xs font-mono text-editorial-textMain bg-[#121212] border border-editorial-border hover:border-editorial-textMuted transition-colors">
                      {s.name}
                    </span>
                  ))}
                </div>
              </RevealOnScroll>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
