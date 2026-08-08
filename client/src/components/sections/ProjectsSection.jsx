import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, ExternalLink, Github, ArrowUpRight, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const ProjectsSection = ({ projects = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // Show first 4 projects initially, show all when showAll is true
  const displayedProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <section id="projects" className="py-20 relative w-full bg-transparent">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-[#a855f7]/10 border border-purple-500/30 dark:border-[#a855f7]/30 flex items-center justify-center text-purple-700 dark:text-[#a855f7]">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-purple-700 dark:text-[#a855f7]">
              Selected Work
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#fafafa]">
              Engineering Projects Showcase
            </h3>
          </div>
        </div>

        {/* Project Showcase Container with Dynamic Side Lightning Track */}
        <div className="relative">
          
          {/* Side Vertical Lightning Track Line */}
          <div className="hidden lg:block absolute left-[-24px] top-4 bottom-4 w-1 rounded-full bg-slate-300 dark:bg-[#27272a]">
            {/* Animated Glowing Dot Tracker */}
            <div
              className="absolute w-4 h-4 -left-1.5 rounded-full bg-sky-500 dark:bg-[#7dd3fc] shadow-[0_0_15px_#38bdf8] border-2 border-white dark:border-[#09090b] transition-all duration-500 ease-out flex items-center justify-center"
              style={{
                top: `${(activeProjectIndex / Math.max(1, displayedProjects.length - 1)) * 92}%`
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
            </div>

            {/* Electric Lighting Overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-sky-500/40 via-purple-500/40 to-blue-500/40 opacity-70"></div>
          </div>

          {/* Project Showcase List */}
          <div className="space-y-12">
            {displayedProjects.map((project, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={project._id || project.slug}
                  onMouseEnter={() => setActiveProjectIndex(idx)}
                  className={`glass-card rounded-3xl p-6 sm:p-10 border transition-all duration-300 group ${
                    activeProjectIndex === idx
                      ? 'border-purple-500/60 dark:border-[#a855f7]/60 shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                      : 'border-slate-300 dark:border-[#27272a]'
                  }`}
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                    
                    {/* Project Image Showcase Column */}
                    <div className={`lg:col-span-6 overflow-hidden rounded-2xl relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-200 dark:bg-[#18181b]">
                        <img
                          src={project.thumbnail || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800'}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#09090b] via-transparent to-transparent opacity-80"></div>
                        
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-slate-900/80 dark:bg-[#09090b]/90 backdrop-blur-md border border-slate-700 dark:border-[#27272a] text-[10px] font-mono text-purple-300 dark:text-[#a855f7] uppercase tracking-wider font-bold">
                            {project.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Project Content Showcase Column */}
                    <div className={`lg:col-span-6 space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-sky-600 dark:text-[#7dd3fc]" />
                        <h4 className="text-2xl font-bold text-slate-900 dark:text-[#fafafa] group-hover:text-sky-600 dark:group-hover:text-[#7dd3fc] transition-colors">
                          {project.title}
                        </h4>
                      </div>

                      <p className="text-slate-800 dark:text-[#a1a1aa] text-sm leading-relaxed font-medium">
                        {project.shortDescription}
                      </p>

                      {/* Problem / Solution preview */}
                      {project.problem && (
                        <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#18181b] border border-slate-300 dark:border-[#27272a] text-xs space-y-1">
                          <span className="font-mono font-bold text-purple-700 dark:text-[#a855f7] uppercase text-[10px]">Problem & Solution:</span>
                          <p className="text-slate-800 dark:text-[#a1a1aa] line-clamp-2 font-medium">{project.solution || project.problem}</p>
                        </div>
                      )}

                      {/* Tech Badges */}
                      <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs text-slate-800 dark:text-[#a1a1aa]">
                        {project.technologies?.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#18181b] border border-slate-300 dark:border-[#27272a] text-[11px] font-bold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-[#27272a]">
                        <Link
                          to={`/projects/${project.slug}`}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/10 dark:bg-[#7dd3fc]/10 hover:bg-sky-500/20 text-sky-700 dark:text-[#7dd3fc] font-bold text-xs border border-sky-400/40 dark:border-[#7dd3fc]/30 transition-all"
                        >
                          <span>View Details</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>

                        {project.repositoryUrl && (
                          <a
                            href={project.repositoryUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#18181b] text-slate-900 dark:text-[#a1a1aa] hover:text-sky-700 text-xs font-mono font-bold transition-colors border border-slate-300 dark:border-[#27272a]"
                          >
                            <Github className="w-4 h-4" />
                            <span>Code</span>
                          </a>
                        )}

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#18181b] text-slate-900 dark:text-[#a1a1aa] hover:text-sky-700 text-xs font-mono font-bold transition-colors border border-slate-300 dark:border-[#27272a]"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Live</span>
                          </a>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Interactive "See More Projects" Toggle */}
        {projects.length > 4 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-purple-500/10 dark:bg-[#a855f7]/10 hover:bg-purple-500/20 text-purple-700 dark:text-[#a855f7] font-bold text-xs border border-purple-500/30 dark:border-[#a855f7]/30 transition-all group"
            >
              <span>{showAll ? 'Show Fewer Projects' : `See More Projects (${projects.length - 4} More)`}</span>
              {showAll ? (
                <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProjectsSection;
