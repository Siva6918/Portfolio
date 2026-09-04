import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, ExternalLink, ChevronDown, ChevronUp, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageWithFallback from '../common/ImageWithFallback';
import SwipeableCarousel from '../common/SwipeableCarousel';
import SectionHeader from '../common/SectionHeader';
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

const projectPalette = [
  { hex: "#38bdf8", glow: "rgba(56,189,248,0.4)", shadow: "rgba(56,189,248,0.2)" },
  { hex: "#4ade80", glow: "rgba(74,222,128,0.4)", shadow: "rgba(74,222,128,0.2)" },
  { hex: "#fb923c", glow: "rgba(251,146,60,0.4)", shadow: "rgba(251,146,60,0.2)" },
  { hex: "#c084fc", glow: "rgba(192,132,252,0.4)", shadow: "rgba(192,132,252,0.2)" },
  { hex: "#f472b6", glow: "rgba(244,114,182,0.4)", shadow: "rgba(244,114,182,0.2)" },
  { hex: "#facc15", glow: "rgba(250,204,21,0.4)", shadow: "rgba(250,204,21,0.2)" },
];

const ProjectsSection = ({ projects = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const { trackInteraction } = useAnalytics();

  const activeProjects = projects.length > 0 ? projects : defaultProjectsFallback;
  const displayedProjects = showAll ? activeProjects : activeProjects.slice(0, 3);

  return (
    <section id="projects" className="py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
      <div className="section-container">
        
        {/* Section Header with Color-Sparked Card Pill & Space Grotesk */}
        <SectionHeader
          badgeText="02 // FEATURED CASE STUDIES"
          icon={Code2}
          color="#38bdf8"
          title="Featured Software "
          gradientTitle="Engineering Work"
          description="Each project is built to solve a concrete problem, featuring scalable backend architecture and clean UI."
        />

        {/* Mobile View Swipe Carousel (sm:hidden) */}
        <div className="block sm:hidden mb-8">
          <SwipeableCarousel showDots={true} showArrows={true}>
            {displayedProjects.map((project, idx) => {
              const c = projectPalette[idx % projectPalette.length];
              return (
                <div key={project._id || project.slug} className="rounded-2xl border overflow-hidden p-5 space-y-4" style={{background:"rgba(9,9,11,0.92)",borderColor:c.hex,boxShadow:`0 8px 30px -6px ${c.shadow}`}}>
                  {/* Top accent line */}
                  <div className="h-0.5 -mx-5 -mt-5 mb-4" style={{background:`linear-gradient(90deg,${c.hex},transparent 70%)`}} />

                  {/* Mobile Thumbnail / Video */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border" style={{borderColor:`${c.hex}40`,background:"rgba(9,9,11,0.95)"}}>
                    {project.videoUrl ? (
                      <video
                        src={project.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <ImageWithFallback
                        src={project.thumbnail}
                        fallbackSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800"
                        alt={project.title}
                        updatedAt={project.updatedAt}
                        className="w-full h-full object-cover object-top"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-md backdrop-blur-md text-[10px] font-mono font-bold uppercase" style={{background:`${c.hex}22`,color:c.hex,border:`1px solid ${c.hex}45`}}>
                        0{idx + 1} // {project.category}
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

                  <div className="space-y-2">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                      {project.shortDescription || project.solution}
                    </p>
                    {project.problem && (
                      <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
                        <span className="font-mono text-[10px] font-bold uppercase block" style={{color:c.hex}}>Core Impact:</span>
                        <p>{project.problem}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 font-mono text-[9px] pt-1">
                    {project.technologies?.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md text-[9px] font-mono border" style={{background:`${c.hex}14`,color:c.hex,borderColor:`${c.hex}35`}}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-3 text-xs font-mono">
                    <Link to={`/projects/${project.slug}`} className="font-bold hover:underline" style={{color:c.hex}}>
                      View Case Study →
                    </Link>
                    {project.repositoryUrl && (
                      <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="text-slate-600 dark:text-zinc-400 font-bold hover:underline">
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline">
                        Live
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </SwipeableCarousel>
        </div>

        {/* Desktop & Tablet Case Studies List */}
        <div className="hidden sm:block space-y-16">
          {displayedProjects.map((project, idx) => {
            const isEven = idx % 2 === 0;
            const c = projectPalette[idx % projectPalette.length];

            return (
              <motion.div 
                key={project._id || project.slug || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: easeCurve }}
                className="group rounded-2xl border overflow-hidden transition-all duration-300"
                style={{ background: "rgba(9,9,11,0.88)", borderColor: "rgba(63,63,70,0.65)" }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = c.hex;
                  e.currentTarget.style.boxShadow = `0 14px 44px -8px ${c.shadow}, 0 0 0 1px ${c.hex}28`;
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(63,63,70,0.65)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                {/* Top accent line */}
                <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${c.hex}ff, transparent 70%)` }} />

                <div className="p-7 sm:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Media Visual Column */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
                      className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}
                    >
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden border transition-colors" style={{ borderColor: `${c.hex}40`, background: "rgba(9,9,11,0.95)" }}>
                        {project.videoUrl ? (
                          <video
                            src={project.videoUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                          />
                        ) : (
                          <ImageWithFallback
                            src={project.thumbnail}
                            fallbackSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800"
                            alt={project.title}
                            updatedAt={project.updatedAt}
                            className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-md backdrop-blur-md text-[11px] font-mono font-bold uppercase" style={{ background: `${c.hex}22`, color: c.hex, border: `1px solid ${c.hex}45` }}>
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
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white transition-colors duration-200">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                          {project.shortDescription}
                        </p>
                      </div>

                      {/* Problem & Solution Split — uncropped text */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-zinc-800/80">
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider block font-bold" style={{ color: c.hex }}>
                            Problem
                          </span>
                          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                            {project.problem || project.description}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider block font-bold" style={{ color: "#4ade80" }}>
                            Solution
                          </span>
                          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                            {project.solution || project.description}
                          </p>
                        </div>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.technologies?.map((tech) => (
                          <span 
                            key={tech}
                            className="px-2.5 py-1 rounded-md text-[10px] font-mono font-medium border"
                            style={{ background: `${c.hex}14`, color: c.hex, borderColor: `${c.hex}35` }}
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
                          className="group/link inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-mono text-xs font-semibold shadow-lg active:scale-95 transition-all duration-200"
                          style={{ background: `linear-gradient(135deg, ${c.hex}, #6366f1)`, boxShadow: `0 6px 20px ${c.shadow}` }}
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
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-mono text-zinc-400 hover:text-white transition-all duration-200"
                            style={{ background: "rgba(9,9,11,0.8)", borderColor: "rgba(63,63,70,0.6)" }}
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
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-all duration-200"
                            style={{ background: "rgba(9,9,11,0.8)", borderColor: "rgba(74,222,128,0.4)" }}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>LIVE</span>
                          </a>
                        )}
                      </div>

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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border text-xs font-mono text-zinc-400 hover:text-white active:scale-95 transition-all duration-200" style={{background:"rgba(9,9,11,0.8)",borderColor:"rgba(63,63,70,0.6)"}}
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


