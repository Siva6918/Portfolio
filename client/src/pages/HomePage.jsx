import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getProjects, getExperience, getSkills, getNotes } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import TextReveal from '../components/common/TextReveal';
import { ArrowRight, Terminal, Sparkles } from 'lucide-react';

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

      {/* ─── HERO SECTION — always visible immediately ─── */}
      <div>
        {/* Removed newArrival block as per user request */}

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-4xl leading-tight mb-8 text-white animate-fade-in">
          I am a software engineer building scalable web applications and intelligent AI systems.
        </h1>

        <p className="text-editorial-textMuted font-mono text-sm max-w-2xl leading-relaxed mb-16 uppercase tracking-wider animate-fade-in" style={{ animationDelay: '150ms' }}>
          {loading ? (
            <span className="opacity-40">Loading profile...</span>
          ) : (
            <>{profile?.role} based in {profile?.location}. {profile?.degree} {profile?.branch} student.</>
          )}
        </p>

        {/* Status Lines */}
        <div className="space-y-6 mb-16 border-l pl-6 border-editorial-border animate-fade-in" style={{ animationDelay: '200ms' }}>
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

        {/* Quick Nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Link to="/work" className="btn-secondary text-center group interactive-lift">
            <span className="group-hover:text-editorial-accent transition-colors">Selected Work</span>
          </Link>
          <Link to="/about" className="btn-secondary text-center group interactive-lift">
            <span className="group-hover:text-editorial-accent transition-colors">About Me</span>
          </Link>
          <Link to="/notes" className="btn-secondary text-center group interactive-lift">
            <span className="group-hover:text-editorial-accent transition-colors">Articles</span>
          </Link>
          <Link to="/contact" className="btn-primary text-center interactive-lift">
            <span>Get in touch</span>
          </Link>
        </div>
      </div>

      <div className="hairline-rule mb-16"></div>

      {/* ─── SELECTED WORK INDEX ─── */}
      <Reveal delay={0}>
        <div className="mb-32">
          <h2 className="text-xs font-mono text-editorial-accent uppercase tracking-widest mb-12">Selected Work Index</h2>
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
          <div className="mt-12 text-right">
            <Link to="/work" className="text-sm font-mono uppercase tracking-wider link-animated">
              View All Work <ArrowRight className="w-4 h-4 link-animated-icon" />
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
            <ul className="space-y-4 font-mono text-sm text-editorial-textMain">
              <li><span className="text-editorial-textMuted">Building:</span> {profile?.nowCurrentlyBuilding || 'Web Applications'}</li>
              <li><span className="text-editorial-textMuted">Learning:</span> {profile?.nowLearning || 'Cloud Architecture'}</li>
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
