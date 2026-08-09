import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, ExternalLink, Github, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { resolveMediaUrl } from '../../services/api';

const ProjectsSection = ({ projects = [] }) => {
  const [showAll, setShowAll] = useState(false);

  const displayedProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <section id="projects" className="py-16 relative w-full">
      <div className="section-container">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
            <FolderGit2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-mono font-semibold tracking-widest text-[#c4b5fd]">
              Selected Work
            </h2>
            <h3 className="text-2xl font-bold text-[#fafafa]">
              Featured Projects
            </h3>
          </div>
        </div>

        {/* Projects Grid — 2 column on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {displayedProjects.map((project) => (
            <div
              key={project._id || project.slug}
              className="glass-card rounded-xl overflow-hidden group hover:border-[#8b5cf6]/30 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/9] overflow-hidden bg-[#18181b]">
                <img
                  src={resolveMediaUrl(project.thumbnail) || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#09090b]/80 backdrop-blur-sm border border-[#27272a] text-[10px] font-mono text-[#c4b5fd] uppercase tracking-wider font-semibold">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h4 className="text-lg font-bold text-[#fafafa] group-hover:text-[#c4b5fd] transition-colors">
                  {project.title}
                </h4>

                <p className="text-sm text-[#a1a1aa] leading-relaxed line-clamp-2">
                  {project.shortDescription}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies?.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-[#18181b] text-[10px] font-mono text-[#a1a1aa] border border-[#27272a]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 6 && (
                    <span className="px-2 py-0.5 rounded-md bg-[#18181b] text-[10px] font-mono text-[#52525b] border border-[#27272a]">
                      +{project.technologies.length - 6}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#27272a]">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#6366f1]/10 text-[#a5b4fc] text-xs font-semibold hover:bg-[#6366f1]/20 transition-colors"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>

                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#71717a] text-xs font-medium hover:text-[#fafafa] hover:bg-[#27272a]/50 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#71717a] text-xs font-medium hover:text-[#fafafa] hover:bg-[#27272a]/50 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Toggle */}
        {projects.length > 4 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-[#a1a1aa] border border-[#27272a] hover:border-[#3f3f46] hover:text-[#fafafa] transition-all"
            >
              <span>{showAll ? 'Show Less' : `Show All Projects (${projects.length})`}</span>
              {showAll ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProjectsSection;
