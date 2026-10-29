import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, resolveMediaUrl } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import RevealOnScroll from '../components/common/RevealOnScroll';
import ProjectsConvoy from '../components/common/ProjectsConvoy';
import { ArrowRight, Flame, Crosshair, Zap, Layers, ListFilter } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('carousel');

  useEffect(() => {
    document.title = "Work | Venkata Siva Reddy";
    window.scrollTo(0, 0);

    const cachedProjects = localStorage.getItem('siva_projects');
    if (cachedProjects) {
      setProjects(JSON.parse(cachedProjects));
      setLoading(false);
    }
    
    getProjects().then(res => {
      if (res.data && res.data.data) {
        setProjects(res.data.data);
        localStorage.setItem('siva_projects', JSON.stringify(res.data.data));
      }
      setLoading(false);
    });
  }, []);

  if (loading && projects.length === 0) {
    return <div className="section-container"><SkeletonLoader count={3} /></div>;
  }

  return (
    <div className="section-container">
      <RevealOnScroll className="animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-marigold uppercase tracking-widest mb-2 font-bold">
              <Flame className="w-4 h-4 text-neonRose fill-neonRose" />
              <span>TACTICAL ARSENAL // OPERATIONS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-grotesk text-iceSilver">
              Work & <span className="bg-gradient-to-r from-marigold to-neonRose bg-clip-text text-transparent">Operations</span>
            </h1>
          </div>
          
          {/* View Mode Switcher Matching Home Page */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#101016] border border-[#242834] shrink-0">
            <button
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                viewMode === 'carousel'
                  ? 'bg-gradient-to-r from-marigold to-neonRose text-black font-bold shadow-md shadow-marigold/20'
                  : 'text-iceSilver-dark hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>LIVE CAROUSEL</span>
            </button>

            <button
              onClick={() => setViewMode('dossier')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                viewMode === 'dossier'
                  ? 'bg-gradient-to-r from-marigold to-neonRose text-black font-bold shadow-md shadow-marigold/20'
                  : 'text-iceSilver-dark hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>FULL DOSSIER</span>
            </button>
          </div>
        </div>
      </RevealOnScroll>

      {/* ─── LIVE CAROUSEL SHOWCASE (SAME AS HOME PAGE) ─── */}
      {viewMode === 'carousel' ? (
        <RevealOnScroll delay={50} className="mb-20">
          <ProjectsConvoy projects={projects} />
        </RevealOnScroll>
      ) : (
        <div className="space-y-32">
        {projects.map((project, index) => (
          <RevealOnScroll key={project._id || index} delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-editorial-textMuted font-mono text-sm">{(index + 1).toString().padStart(2, '0')}</span>
                  <Link to={`/work/${project.slug}`} className="group">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-grotesk text-white font-bold group-hover:text-editorial-accent transition-colors">
                      {project.title}
                    </h2>
                  </Link>
                </div>
                
                <p className="text-editorial-textMain text-lg sm:text-xl max-w-3xl leading-relaxed">
                  {project.shortDescription}
                </p>

                <div className="font-mono text-xs text-editorial-textMuted uppercase tracking-wider mb-2">
                  {project.technologies?.join(' · ')}
                </div>

                <div className="mt-4">
                  <Link to={`/work/${project.slug}`} className="text-editorial-accent text-sm font-mono uppercase tracking-wider group inline-flex items-center gap-2">
                    Read Case Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {project.thumbnail && (
                <div className="w-full max-w-xl">
                  <Link to={`/work/${project.slug}`} className="block overflow-hidden group img-editorial">
                    <img 
                      src={resolveMediaUrl(project.thumbnail)} 
                      alt={project.title} 
                      loading="lazy"
                      className="w-full aspect-video object-cover transition-all duration-700 group-hover:scale-105"
                    />
                  </Link>
                </div>
              )}
            </div>
          </RevealOnScroll>
        ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
