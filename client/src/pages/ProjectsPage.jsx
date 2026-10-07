import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, resolveMediaUrl } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { ArrowRight } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <h1 className="text-4xl sm:text-5xl font-bold mb-16">Work</h1>
      </RevealOnScroll>
      
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
    </div>
  );
};

export default ProjectsPage;
