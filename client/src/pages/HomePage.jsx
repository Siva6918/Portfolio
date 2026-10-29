import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getProjects, getExperience, getSkills, getNotes } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import TextReveal from '../components/common/TextReveal';
import ProjectsConvoy from '../components/common/ProjectsConvoy';
import { ArrowRight, Terminal, Sparkles, Flame, Crosshair, Zap, ListFilter } from 'lucide-react';

// Simple hook: fires once when element enters viewport
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, visible];
}

// Section wrapper with slide-up-on-scroll
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal(delay);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

const HomePage = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workViewMode, setWorkViewMode] = useState('carousel');

  useEffect(() => {
    document.title = 'Venkata Siva Reddy | Full Stack Developer';
    Promise.allSettled([
      getProfile(), getProjects(), getExperience(), getSkills(), getNotes()
    ]).then(([profRes, projRes, expRes, skillRes, notesRes]) => {
      if (profRes.status === 'fulfilled' && profRes.value.data?.data) setProfile(profRes.value.data.data);
      if (projRes.status === 'fulfilled' && projRes.value.data?.data) setProjects(projRes.value.data.data);
      if (expRes.status === 'fulfilled' && expRes.value.data?.data) setExperience(expRes.value.data.data);
      if (skillRes.status === 'fulfilled' && skillRes.value.data?.data) setSkills(skillRes.value.data.data);
      if (notesRes.status === 'fulfilled' && notesRes.value.data?.data) setNotes(notesRes.value.data.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="section-container pt-32">

      {/* ─── HERO SECTION: Free Fire & Tactical Engineering Vibe ─── */}
      <div>
        {/* Gamer & Survivor Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-neonRose/15 text-neonRose border border-neonRose/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <Flame className="w-3.5 h-3.5 text-neonRose fill-neonRose animate-pulse" />
            FREE FIRE CLUTCH GAMER & DEV
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-marigold/15 text-marigold border border-marigold/40">
            <Crosshair className="w-3.5 h-3.5 text-marigold" />
            HIGH APM // TACTICAL ARCHITECT
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-4xl leading-tight mb-8 text-iceSilver animate-fade-in">
          I am a software engineer building{' '}
          <span className="bg-gradient-to-r from-marigold via-neonRose to-iceSilver bg-clip-text text-transparent">
            scalable web applications & intelligent AI systems.
          </span>
        </h1>

        <p className="text-iceSilver-dark font-mono text-sm max-w-2xl leading-relaxed mb-16 uppercase tracking-wider animate-fade-in" style={{ animationDelay: '150ms' }}>
          {loading ? (
            <span className="opacity-40">Loading profile...</span>
          ) : (
            <>{profile?.role} based in {profile?.location}. {profile?.degree} {profile?.branch} student.</>
          )}
        </p>

        {/* Status Lines with Free Fire & Tactical styling */}
        <div className="space-y-6 mb-16 border-l-2 pl-6 border-gradient-to-b from-marigold to-neonRose animate-fade-in" style={{ animationDelay: '200ms', borderColor: '#f59e0b' }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-mono text-xs text-marigold font-bold uppercase w-48 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-marigold" /> Currently Building:
            </span>
            <span className="text-iceSilver text-sm">{profile?.homeStatusCurrentlyBuilding || 'Agentic AI systems & Scalable web apps'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-mono text-xs text-neonRose font-bold uppercase w-48 flex items-center gap-1.5">
              <Crosshair className="w-3 h-3 text-neonRose" /> High APM & Focus:
            </span>
            <span className="text-iceSilver text-sm">Competitive Free Fire Tactics · Rapid Problem Solving · Distributed Systems</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-mono text-xs text-iceSilver-dark uppercase w-48 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-iceSilver" /> Open To:
            </span>
            <span className="text-iceSilver text-sm">{profile?.homeStatusOpenTo || 'Software Engineering Internships & Team Collaborations'}</span>
          </div>
        </div>

        {/* Quick Nav with Theme Colors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Link to="/work" className="btn-secondary text-center group interactive-lift">
            <span className="group-hover:text-marigold transition-colors font-bold">Selected Work</span>
          </Link>
          <Link to="/about" className="btn-secondary text-center group interactive-lift">
            <span className="group-hover:text-marigold transition-colors font-bold">About Me</span>
          </Link>
          <Link to="/playground" className="btn-secondary text-center group interactive-lift">
            <span className="group-hover:text-neonRose transition-colors font-bold">Playground & Games</span>
          </Link>
          <Link to="/contact" className="btn-primary text-center interactive-lift">
            <span>Get in touch</span>
          </Link>
        </div>
      </div>

      <div className="hairline-rule mb-16"></div>

      {/* ─── LIVE ARSENAL & SELECTED WORK SHOWCASE ─── */}
      <Reveal delay={0}>
        <div className="mb-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono text-marigold uppercase tracking-widest block mb-1">
                TACTICAL ARSENAL // FEATURED WORK
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-grotesk text-iceSilver flex items-center gap-2">
                <Flame className="w-6 h-6 text-marigold fill-marigold" />
                <span>Selected Work & Live Operations</span>
              </h2>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#101016] border border-[#242834] shrink-0">
              <button
                onClick={() => setWorkViewMode('carousel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  workViewMode === 'carousel'
                    ? 'bg-gradient-to-r from-marigold to-neonRose text-black font-bold shadow-md shadow-marigold/20'
                    : 'text-iceSilver-dark hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>LIVE CAROUSEL</span>
              </button>

              <button
                onClick={() => setWorkViewMode('index')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  workViewMode === 'index'
                    ? 'bg-gradient-to-r from-marigold to-neonRose text-black font-bold shadow-md shadow-marigold/20'
                    : 'text-iceSilver-dark hover:text-white'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>INDEX LIST</span>
              </button>
            </div>
          </div>

          {/* Render Live Projects Carousel */}
          {workViewMode === 'carousel' ? (
            <div className="w-full -mx-4 sm:-mx-6 px-4 sm:px-6">
              <ProjectsConvoy projects={projects} />
            </div>
          ) : (
            <div className="flex flex-col">
              {loading ? (
                <SkeletonLoader count={3} type="card" />
              ) : projects.length === 0 ? (
                <p className="text-editorial-textMuted font-mono text-sm">No projects yet. Add some from the admin panel.</p>
              ) : (
                projects.slice(0, 4).map((project, index) => (
                  <Link
                    key={project._id || index}
                    to={`/work/${project.slug}`}
                    className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-editorial-border hover:bg-[#1a1a1a] transition-colors -mx-6 px-6"
                  >
                    <div className="flex items-center gap-8 w-full md:w-1/2">
                      <span className="text-editorial-textMuted font-mono text-sm group-hover:text-editorial-accent transition-colors">{(index + 1).toString().padStart(2, '0')}</span>
                      {project.thumbnail && (
                        <div className="w-16 h-12 overflow-hidden rounded-lg border border-editorial-border shrink-0 hidden sm:block">
                          <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.15]" />
                        </div>
                      )}
                      <h3 className="text-lg sm:text-xl font-grotesk text-white group-hover:text-editorial-accent transition-colors transform group-hover:translate-x-2 duration-300">{project.title}</h3>
                    </div>
                    <div className="mt-4 md:mt-0 font-mono text-xs text-editorial-textMuted w-full md:w-1/2 md:text-right flex items-center justify-start md:justify-end gap-4">
                      <span>{project.technologies?.slice(0, 3).join(' • ')}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-editorial-accent" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          <div className="mt-8 text-right">
            <Link to="/work" className="text-sm font-mono uppercase tracking-wider link-animated">
              View All Work Dossier <ArrowRight className="w-4 h-4 link-animated-icon" />
            </Link>
          </div>
        </div>
      </Reveal>

      {/* ─── SHORT ABOUT & NOW ─── */}
      <Reveal delay={50}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          <div>
            <h2 className="text-xs font-mono text-editorial-accent uppercase tracking-widest mb-6">Brief Intro</h2>
            <p className="text-editorial-textMain text-lg leading-relaxed mb-6 font-grotesk">
              {profile?.shortDescription || "I'm a full-stack engineer passionate about crafting scalable, performant, and beautifully designed digital experiences."}
            </p>
            <Link to="/about" className="text-sm font-mono text-white hover:text-editorial-accent uppercase tracking-widest inline-flex items-center gap-2 transition-colors">
              Full Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-[#121212] p-8 rounded-xl border border-editorial-border">
            <h2 className="text-xs font-mono text-editorial-accent uppercase tracking-widest mb-6 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> What I'm doing /now
            </h2>
            <ul className="space-y-3 font-mono text-sm text-editorial-textMain">
              <li className="flex gap-2"><span className="text-editorial-accent">▹</span> Developing my portfolio</li>
              <li className="flex gap-2"><span className="text-editorial-accent">▹</span> Performing coding daily for Hackclub</li>
              <li className="flex gap-2"><span className="text-editorial-accent">▹</span> Doing major project as Career GPT</li>
              <li className="flex gap-2"><span className="text-editorial-accent">▹</span> Participating in many hackathons</li>
              <li className="flex gap-2"><span className="text-editorial-accent">▹</span> Applying for internships</li>
              <li className="flex gap-2"><span className="text-editorial-accent">▹</span> Learning software related technologies</li>
            </ul>
            <div className="mt-8">
              <Link to="/now" className="text-xs font-mono text-white hover:text-editorial-accent uppercase tracking-widest inline-flex items-center gap-2 transition-colors">
                Read /now page <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ─── EXPERIENCE & SKILLS PREVIEW ─── */}
      <Reveal delay={50}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          <div>
            <h2 className="text-xs font-mono text-editorial-accent uppercase tracking-widest mb-8">Recent Experience</h2>
            {loading ? (
              <SkeletonLoader count={3} type="text" />
            ) : (
              <div className="space-y-6">
                {experience.slice(0, 3).map((exp) => (
                  <div key={exp._id} className="border-l border-editorial-border pl-6 pb-2">
                    <div className="font-mono text-xs text-editorial-textMuted mb-1">{exp.year || `${exp.startDate} - ${exp.endDate || 'Present'}`}</div>
                    <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                    <div className="text-sm text-editorial-textMuted mt-1">{exp.company}</div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/experience" className="text-xs font-mono text-white hover:text-editorial-accent uppercase tracking-widest mt-8 inline-flex items-center gap-2 transition-colors">
              View Full Timeline <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div>
            <h2 className="text-xs font-mono text-editorial-accent uppercase tracking-widest mb-8">Core Toolkit</h2>
            {loading ? (
              <SkeletonLoader count={2} type="text" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 15).map((skill) => (
                  <span key={skill._id} className="px-3 py-1.5 border border-editorial-border rounded-md font-mono text-xs text-editorial-textMain bg-[#121212] hover:border-editorial-textMuted transition-colors">
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
            <Link to="/skills" className="text-xs font-mono text-white hover:text-editorial-accent uppercase tracking-widest mt-8 inline-flex items-center gap-2 transition-colors">
              View All Skills <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </Reveal>

      <div className="hairline-rule mb-16"></div>

      {/* ─── NOTES/BLOG PREVIEW ─── */}
      {!loading && notes.length > 0 && (
        <Reveal delay={50}>
          <div className="mb-32">
            <h2 className="text-xs font-mono text-editorial-accent uppercase tracking-widest mb-8">Recent Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notes.slice(0, 3).map((note, idx) => (
                <Link
                  key={note._id}
                  to={`/notes/${note.slug}`}
                  className="block p-6 border border-editorial-border rounded-xl bg-[#121212] hover:border-editorial-textMuted transition-all interactive-lift"
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  <div className="font-mono text-[10px] text-editorial-accent uppercase mb-3">{note.category} • {note.readTime}</div>
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">{note.title}</h3>
                  <p className="text-xs font-mono text-editorial-textMuted line-clamp-3">{note.excerpt}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-right">
              <Link to="/notes" className="text-editorial-accent text-sm font-mono hover:underline uppercase tracking-wider group inline-flex items-center gap-2">
                Read All Notes <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </Reveal>
      )}

      {/* ─── CTA FOOTER PREVIEW ─── */}
      <Reveal delay={0}>
        <div className="text-center py-20 bg-editorial-accent/5 border border-editorial-accent/20 rounded-2xl mb-10">
          <h2 className="text-3xl font-bold text-white mb-6">Let's build something.</h2>
          <p className="text-editorial-textMuted font-mono text-sm max-w-md mx-auto mb-10">
            Currently open to new opportunities, freelance work, and open source collaboration.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Get in touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Reveal>

    </div>
  );
};

export default HomePage;
