import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, resolveMediaUrl } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';

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
    <div className="section-container animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold mb-16">Work</h1>
      
      <div className="space-y-32">
        {projects.map((project, index) => (
          <div key={project._id || index} className="flex flex-col gap-6">
            <div className="flex items-baseline gap-4">
              <span className="text-editorial-textMuted font-mono text-sm">{(index + 1).toString().padStart(2, '0')}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-grotesk text-white font-bold">{project.title}</h2>
            </div>
            
            <p className="text-editorial-textMain text-lg sm:text-xl max-w-3xl leading-relaxed">
              {project.shortDescription}
            </p>

            <div className="font-mono text-xs text-editorial-textMuted uppercase tracking-wider mb-6">
              {project.technologies?.join(' · ')}
            </div>

            {project.thumbnail && (
              <Link to={`/work/${project.slug}`} className="block overflow-hidden group">
                <img 
                  src={resolveMediaUrl(project.thumbnail)} 
                  alt={project.title} 
                  loading="lazy"
                  className="w-full aspect-video object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 interactive-lift"
                />
              </Link>
            )}

            <div className="mt-4">
              <Link to={`/work/${project.slug}`} className="text-editorial-accent text-sm font-mono hover:underline uppercase tracking-wider">
                Read Case Study →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
