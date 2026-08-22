import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageWithFallback from '../common/ImageWithFallback';
import SwipeableCarousel from '../common/SwipeableCarousel';
import { useAnalytics } from '../../context/AnalyticsContext';

const easeCurve = [0.16, 1, 0.3, 1];

const defaultProjectsFallback = [
  {
    _id: '1',
    title: 'NutriCloud Monitor',
    slug: 'nutricloud-monitor',
    shortDescription: 'Production IoT-cloud monitoring system for real-time nutritional tracking and environment telemetry.',
    problem: 'Nutrition labs needed a zero-latency telemetry dashboard for real-time monitoring across distributed nodes.',
    solution: 'Designed a full-stack MERN platform with Redis caching, WebSockets for sub-100ms updates, and dynamic charts.',
    features: ['Real-time WebSocket Data Pipeline', 'Redis Caching for Analytics Query Acceleration', 'Role-Based Access Control (RBAC)', 'Interactive Telemetry Visualizations'],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'WebSockets', 'Tailwind CSS'],
    category: 'IoT / Full-Stack',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800',
    repositoryUrl: 'https://github.com/vasanreddy/NutriCloud',
    liveUrl: ''
  },
  {
    _id: '2',
    title: 'DocSpot Healthcare Portal',
    slug: 'docspot-healthcare-portal',
    shortDescription: 'Comprehensive doctor appointment booking and patient record management system.',
    problem: 'Patients face complex booking workflows and lack unified medical history access.',
    solution: 'Engineered an intuitive healthcare portal with real-time slot scheduling and encrypted document storage.',
    features: ['Real-time Slot Booking Engine', 'JWT Auth & Session Management', 'Patient History Timeline', 'Doctor Availability Management'],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Cloudinary'],
    category: 'Healthcare / Web App',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800',
    repositoryUrl: 'https://github.com/vasanreddy/DocSpot',
    liveUrl: ''
  },
  {
    _id: '3',
    title: 'Candidate Rank System',
    slug: 'candidate-rank-system',
    shortDescription: 'AI-driven candidate evaluation system using natural language processing to extract and rank applicant profiles.',
    problem: 'HR teams spend excessive manual hours reviewing resume PDFs without structured metric comparison.',
    solution: 'Created an intelligent parsing pipeline with spaCy NLP that calculates weighted keyword relevance and presents ranked leaderboards.',
    features: ['Resume Parsing via spaCy NLP', 'Job Requirement Keyword Matching', 'Applicant Leaderboard', 'Detailed Skill Gap Analysis'],
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Python', 'spaCy'],
    category: 'Recruitment / AI / NLP',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800',
    repositoryUrl: 'https://github.com/vasanreddy/CandidateRankSystem',
    liveUrl: ''
  }
];

const ProjectsSection = ({ projects = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const { trackInteraction } = useAnalytics();

  const activeProjects = projects.length > 0 ? projects : defaultProjectsFallback;
  const displayedProjects = showAll ? activeProjects : activeProjects.slice(0, 3);

  return (
    <section id="projects" className="py-20 relative w-full border-t border-slate-200 dark:border-zinc-800/60">
      <div className="section-container">
        
        {/* Section Header Stagger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.0, ease: easeCurve }}
              className="text-xs font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-semibold block"
            >
              02 // CASE STUDIES
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1"
            >
              Featured Software Engineering Work
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
            className="text-xs font-mono text-slate-600 dark:text-white/50 max-w-sm"
          >
            Each project is built to solve a concrete problem, featuring scalable backend architecture and clean UI.
          </motion.p>
        </div>

        {/* Mobile View Swipe Carousel (sm:hidden) */}
        <div className="block sm:hidden mb-8">
          <SwipeableCarousel showDots={true} showArrows={true}>
            {displayedProjects.map((project) => (
              <div key={project._id || project.slug} className="editorial-card p-5 space-y-4">
                {/* Mobile Thumbnail / Video */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 shadow-md">
                  {project.videoUrl ? (
                    <video
                      src={project.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageWithFallback
                      src={project.thumbnail}
                      fallbackSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800"
                      alt={project.title}
                      updatedAt={project.updatedAt}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200 dark:border-zinc-700 text-[10px] font-mono text-indigo-600 dark:text-indigo-300 font-semibold shadow-sm">
                      {project.category}
                    </span>
                  </div>
                  {project.videoUrl && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-red-500/90 text-white text-[9px] font-mono font-bold uppercase tracking-wider shadow-sm">
                        ▶ LIVE DEMO
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                    {project.shortDescription || project.solution}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 font-mono text-[9px] pt-1">
                  {project.technologies?.slice(0, 4).map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-3 text-xs font-mono">
                  <Link to={`/projects/${project.slug}`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                    View Case Study →
                  </Link>
                  {project.repositoryUrl && (
                    <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="text-slate-600 dark:text-zinc-400 font-bold hover:underline">
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                      Live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </SwipeableCarousel>
        </div>

        {/* Desktop & Tablet Case Studies List */}
        <div className="hidden sm:block space-y-16">
          {displayedProjects.map((project, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div 
                key={project._id || project.slug || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: easeCurve }}
                className="editorial-card p-6 sm:p-8 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-zinc-700 transition-all duration-300 group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Media Visual Column */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
                    className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                  >
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 shadow-md group-hover:border-indigo-500/40 transition-colors">
                      {project.videoUrl ? (
                        <video
                          src={project.videoUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <ImageWithFallback
                          src={project.thumbnail}
                          fallbackSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800"
                          alt={project.title}
                          updatedAt={project.updatedAt}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200 dark:border-zinc-700 text-[11px] font-mono text-indigo-600 dark:text-indigo-300 font-semibold uppercase shadow-sm">
                          0{idx + 1} // {project.category || 'Engineering Project'}
                        </span>
                      </div>
                      {project.videoUrl && (
                        <div className="absolute top-4 right-4">
                          <span className="px-2.5 py-1 rounded-full bg-red-500/90 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                            ▶ LIVE DEMO
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Content Column with Staggered Internal Elements */}
                  <div className={`lg:col-span-6 space-y-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-700 dark:text-white/70 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Problem & Solution Split */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-zinc-800/80">
                      <div>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-white/50 uppercase tracking-wider block font-semibold mb-1">
                          Problem
                        </span>
                        <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed line-clamp-3">
                          {project.problem || project.description}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block font-semibold mb-1">
                          Solution
                        </span>
                        <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed line-clamp-3">
                          {project.solution || project.description}
                        </p>
                      </div>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.technologies?.map((tech) => (
                        <span 
                          key={tech}
                          className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-950 text-[11px] font-mono text-slate-700 dark:text-white/60 border border-slate-200 dark:border-zinc-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Link Buttons */}
                    <div className="flex items-center gap-3 pt-3">
                      <Link
                        to={`/projects/${project.slug}`}
                        onClick={() => trackInteraction('project_open', project.title, 'Projects')}
                        className="group/link inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-md active:scale-95 transition-all duration-200"
                      >
                        <span>VIEW CASE STUDY</span>
                        <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5 transition-transform duration-200" />
                      </Link>

                      {project.repositoryUrl && (
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => trackInteraction('project_github_click', project.title, 'Projects')}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>SOURCE</span>
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => trackInteraction('live_demo_click', project.title, 'Projects')}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>LIVE</span>
                        </a>
                      )}
                    </div>

                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Toggle Show All */}
        {activeProjects.length > 3 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all duration-200 shadow-sm"
            >
              <span>{showAll ? 'SHOW FEATURED ONLY' : `VIEW ALL PROJECTS (${activeProjects.length})`}</span>
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProjectsSection;
