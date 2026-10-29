import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, Pause, FastForward, RotateCcw, ArrowRight, 
  ExternalLink, Github, Sparkles, Navigation, Flame, Crosshair, Shield, Zap
} from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

const defaultProjects = [
  {
    _id: '1',
    title: 'NutriCloud Monitor',
    slug: 'nutricloud-monitor',
    shortDescription: 'Production IoT-cloud monitoring system for real-time nutritional tracking and environment telemetry.',
    problem: 'Nutrition labs needed a zero-latency telemetry dashboard for real-time monitoring across distributed nodes.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'WebSockets'],
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
    shortDescription: 'AI-driven candidate evaluation system using natural language processing to rank applicant profiles.',
    problem: 'HR teams spend excessive manual hours reviewing resume PDFs without structured metric comparison.',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Python', 'spaCy'],
    category: 'Recruitment / AI / NLP',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800',
    repositoryUrl: 'https://github.com/vasanreddy/CandidateRankSystem',
    liveUrl: ''
  },
  {
    _id: '4',
    title: 'Career GPT Intelligence',
    slug: 'career-gpt-intelligence',
    shortDescription: 'Generative AI career counselor providing personalized roadmap recommendations and mock interview analysis.',
    problem: 'Graduating engineering students lack tailored guidance based on dynamic tech job market trends.',
    technologies: ['React', 'FastAPI', 'LangChain', 'OpenAI', 'Pinecone', 'Tailwind CSS'],
    category: 'Generative AI / Agent',
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800',
    repositoryUrl: 'https://github.com/vasanreddy',
    liveUrl: ''
  },
  {
    _id: '5',
    title: 'DevOps CI/CD Telemetry Pipeline',
    slug: 'devops-cicd-pipeline',
    shortDescription: 'Containerized microservices pipeline with Prometheus monitoring and automated blue-green deployments.',
    problem: 'Slow deployment cycles and lack of cluster observability hindered release velocity.',
    technologies: ['Docker', 'Kubernetes', 'AWS', 'Prometheus', 'Grafana', 'GitHub Actions'],
    category: 'Cloud / DevOps',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=800',
    repositoryUrl: 'https://github.com/vasanreddy',
    liveUrl: ''
  }
];

// Tactical Free Fire Theme Colors: Marigold (#f59e0b), Neon Rose (#f43f5e), Ice Silver (#e2e8f0), Black (#08080a)
const projectPalettes = [
  { hex: '#f59e0b', glow: 'rgba(245,158,11,0.45)', name: 'GOLDEN FLAME', border: '#f59e0b' },
  { hex: '#f43f5e', glow: 'rgba(244,63,94,0.45)', name: 'NEON CRIMSON', border: '#f43f5e' },
  { hex: '#e2e8f0', glow: 'rgba(226,232,240,0.35)', name: 'ICE TITANIUM', border: '#cbd5e1' },
  { hex: '#fbbf24', glow: 'rgba(251,191,36,0.45)', name: 'SOLAR MARIGOLD', border: '#fbbf24' },
  { hex: '#fb7185', glow: 'rgba(251,113,133,0.45)', name: 'CYBER ROSE', border: '#fb7185' },
];

export default function ProjectsConvoy({ projects = [] }) {
  const displayProjects = projects && projects.length > 0 ? projects : defaultProjects;

  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [direction, setDirection] = useState(1);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const animFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);

  // Play synthesized laser pulse sound effect
  const playLaserPulse = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio policy safe fallback
    }
  }, []);

  // Smooth RAF scrolling loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying && !isHovered && !isDraggingRef.current && trackRef.current) {
        const baseSpeed = 85;
        const step = baseSpeed * speedMultiplier * direction * delta;
        offsetRef.current += step;

        const maxScroll = trackRef.current.scrollWidth - trackRef.current.clientWidth;
        if (maxScroll > 0) {
          if (offsetRef.current > maxScroll) {
            offsetRef.current = 0;
          } else if (offsetRef.current < 0) {
            offsetRef.current = maxScroll;
          }
          trackRef.current.scrollLeft = offsetRef.current;
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, isHovered, speedMultiplier, direction]);

  // Jump to specific card
  const jumpToProject = (idx) => {
    setActiveProjectIndex(idx);
    if (!trackRef.current) return;
    const cardEl = document.getElementById(`project-card-${idx}`);
    if (cardEl) {
      const containerLeft = trackRef.current.offsetLeft;
      const targetLeft = cardEl.offsetLeft - containerLeft - 80;
      offsetRef.current = Math.max(0, targetLeft);
      trackRef.current.scrollTo({
        left: offsetRef.current,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.pageX || (e.touches && e.touches[0].pageX);
    dragStartOffsetRef.current = trackRef.current ? trackRef.current.scrollLeft : 0;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const currentX = e.pageX || (e.touches && e.touches[0].pageX);
    const diff = dragStartXRef.current - currentX;
    trackRef.current.scrollLeft = dragStartOffsetRef.current + diff;
    offsetRef.current = trackRef.current.scrollLeft;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="w-full relative py-6 select-none">
      
      {/* ─── TACTICAL CONTROL HUD (Free Fire Theme: Marigold, Neon Rose, Ice Silver, Black) ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-3 sm:px-5 py-3 rounded-2xl border border-[#242834] bg-[#08080a]/95 backdrop-blur-md shadow-2xl">
        
        {/* Left: Tactical Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPlaying ? 'bg-marigold' : 'bg-neonRose'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-marigold' : 'bg-neonRose'}`} />
            </span>
            <span className="font-mono text-xs text-iceSilver font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-marigold" />
              <span>LIVE ARSENAL // LOADOUT</span>
            </span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101016] text-iceSilver-dark border border-[#242834] hidden sm:inline">
            {displayProjects.length} MISSIONS ACTIVE
          </span>

          <span className="text-[10px] font-mono text-marigold hidden md:inline">
            {isHovered ? '⚡ PAUSED TO INSPECT' : isPlaying ? 'ACTIVE GLIDE' : 'STANDBY'}
          </span>
        </div>

        {/* Center: Controls (Play, Pause, Speed, Pulse) */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg border border-[#242834] bg-[#101016] hover:bg-[#181824] text-iceSilver text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title={isPlaying ? "Pause scroll" : "Resume scroll"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-marigold" /> : <Play className="w-3.5 h-3.5 text-neonRose" />}
            <span>{isPlaying ? 'PAUSE' : 'RESUME'}</span>
          </button>

          <button
            onClick={() => {
              setSpeedMultiplier(prev => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1));
            }}
            className="px-2.5 py-1.5 rounded-lg border border-[#242834] bg-[#101016] hover:bg-[#181824] text-iceSilver text-xs font-mono flex items-center gap-1 transition-all"
            title="Toggle speed"
          >
            <FastForward className="w-3.5 h-3.5 text-iceSilver" />
            <span>{speedMultiplier === 1 ? '1x' : speedMultiplier === 2 ? '2x TURBO' : '0.5x'}</span>
          </button>

          <button
            onClick={() => setDirection(d => -d)}
            className="p-1.5 rounded-lg border border-[#242834] bg-[#101016] hover:bg-[#181824] text-iceSilver hover:text-white transition-all"
            title="Reverse direction"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={playLaserPulse}
            className="px-2.5 py-1.5 rounded-lg border border-neonRose/40 bg-neonRose/15 hover:bg-neonRose/25 text-neonRose text-xs font-mono font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
            title="Trigger audio pulse"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PULSE</span>
          </button>
        </div>

        {/* Right: Quick Jump Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {displayProjects.map((p, idx) => (
            <button
              key={p._id || idx}
              onClick={() => jumpToProject(idx)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono border transition-all ${
                activeProjectIndex === idx
                  ? 'bg-gradient-to-r from-marigold to-neonRose text-black border-transparent font-bold shadow-sm'
                  : 'bg-[#101016] text-iceSilver-dark border-[#242834] hover:text-iceSilver'
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>

      </div>

      {/* ─── TACTICAL LASER ENERGY LINE ─── */}
      <div className="relative w-full h-2 mb-2 flex items-center overflow-hidden pointer-events-none opacity-60">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-marigold to-neonRose shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
        <div className="absolute top-0 right-1/4 w-2 h-2 rounded-full bg-neonRose animate-ping" />
      </div>

      {/* ─── MOVING CONVOY CONTAINER ─── */}
      <div 
        ref={trackRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseUp();
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="relative w-full overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing pb-8 pt-2"
        style={{ scrollBehavior: 'auto' }}
      >
        <div className="inline-flex items-stretch pl-4 pr-32 min-w-max gap-6">
          
          {/* ═══════════════════════════════════════════════ */}
          {/* LEAD CARD: COMMAND HUB & OPERATOR STATS         */}
          {/* ═══════════════════════════════════════════════ */}
          <div className="w-[300px] h-[450px] rounded-2xl border-2 border-marigold/80 bg-gradient-to-br from-[#121016] via-[#08080a] to-[#181216] shadow-[0_12px_44px_rgba(245,158,11,0.25)] p-5 flex flex-col justify-between shrink-0 relative overflow-hidden">
            
            {/* Top Energy Beam */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-marigold via-neonRose to-iceSilver" />
            
            <div className="flex items-center justify-between border-b border-[#242834] pb-3">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-marigold/15 text-marigold border border-marigold/40 font-bold uppercase">
                COMMAND HUB
              </span>
              <span className="text-[10px] font-mono text-neonRose font-bold">
                RANK: GRANDMASTER
              </span>
            </div>

            <div className="space-y-3 my-auto">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-marigold to-neonRose flex items-center justify-center text-black shadow-lg shadow-marigold/20">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-grotesk text-iceSilver">
                Venkata Siva Reddy
              </h3>
              <p className="text-xs font-mono text-iceSilver-dark leading-relaxed">
                Full-Stack Software Engineer & Free Fire clutch tactician. Architecting scalable web applications, agentic AI, and distributed systems.
              </p>

              {/* Combat Stats Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 rounded-lg bg-[#101016] border border-[#242834]">
                  <span className="text-[9px] font-mono text-iceSilver-dark block">PLAY STYLE</span>
                  <span className="text-xs font-mono font-bold text-marigold">HIGH APM & CLUTCH</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#101016] border border-[#242834]">
                  <span className="text-[9px] font-mono text-iceSilver-dark block">SYSTEM STACK</span>
                  <span className="text-xs font-mono font-bold text-neonRose">MERN + AI + AWS</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#242834] flex items-center justify-between text-[10px] font-mono text-iceSilver-dark">
              <span className="text-marigold font-bold flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5" /> READY TO DEPLOY
              </span>
              <span className="text-neonRose font-bold">{displayProjects.length} OPERATIONS</span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════ */}
          {/* MISSION PROJECT CARDS                           */}
          {/* ═══════════════════════════════════════════════ */}
          {displayProjects.map((project, idx) => {
            const colorMeta = projectPalettes[idx % projectPalettes.length];

            return (
              <div 
                key={project._id || project.slug || idx}
                id={`project-card-${idx}`}
                className="w-[360px] sm:w-[420px] h-[450px] rounded-2xl border-2 bg-gradient-to-b from-[#12121a] via-[#0a0a0f] to-[#08080a] p-5 flex flex-col justify-between shrink-0 transition-all duration-300 relative overflow-hidden shadow-2xl group"
                style={{
                  borderColor: colorMeta.hex,
                  boxShadow: `0 14px 44px -10px ${colorMeta.glow}`
                }}
                onMouseEnter={() => setActiveProjectIndex(idx)}
              >
                {/* Top Accent Line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ background: `linear-gradient(90deg, ${colorMeta.hex}, #f43f5e, #e2e8f0)` }}
                />
                
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-[#242834] pb-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border"
                      style={{
                        color: colorMeta.hex,
                        borderColor: `${colorMeta.hex}55`,
                        background: `${colorMeta.hex}18`
                      }}
                    >
                      MISSION {(idx + 1).toString().padStart(2, '0')} // {project.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-iceSilver-dark">
                    LOADOUT #{idx + 1}
                  </span>
                </div>

                {/* Project Screenshot / Thumbnail Display */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-[#242834] bg-black group/win mt-1">
                  <ImageWithFallback
                    src={project.thumbnail}
                    fallbackSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800"
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/win:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-white/10 pointer-events-none" />

                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="text-[11px] font-mono font-bold text-white px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-[#242834]">
                      {project.title}
                    </span>
                  </div>
                </div>

                {/* Project Description */}
                <div className="space-y-1 mt-1">
                  <h4 className="text-lg font-bold font-grotesk text-iceSilver leading-tight group-hover:text-marigold transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-xs text-iceSilver-dark font-mono line-clamp-2 leading-relaxed">
                    {project.shortDescription || project.problem}
                  </p>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies?.slice(0, 5).map(tech => (
                    <span 
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] font-mono border"
                      style={{
                        background: `${colorMeta.hex}15`,
                        color: colorMeta.hex,
                        borderColor: `${colorMeta.hex}40`
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="pt-3 border-t border-[#242834] flex items-center justify-between gap-2 mt-1">
                  <Link
                    to={`/work/${project.slug}`}
                    className="px-4 py-2 rounded-xl font-mono text-xs font-bold text-black flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 bg-gradient-to-r from-marigold to-neonRose hover:opacity-95"
                  >
                    <span>EXPLORE MISSION</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.repositoryUrl && (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-[#242834] bg-[#101016] hover:bg-[#181824] text-iceSilver hover:text-white transition-colors"
                        title="View GitHub Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-neonRose/40 bg-neonRose/15 hover:bg-neonRose/25 text-neonRose transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

          {/* ═══════════════════════════════════════════════ */}
          {/* BOOYAH // SQUAD COLLABORATION END CARD          */}
          {/* ═══════════════════════════════════════════════ */}
          <div className="w-[300px] h-[450px] rounded-2xl border-2 border-neonRose/70 bg-gradient-to-br from-[#16080e] via-[#090608] to-[#08080a] p-5 flex flex-col justify-between shrink-0 shadow-[0_12px_44px_rgba(244,63,94,0.3)]">
            
            <div className="flex items-center justify-between border-b border-[#242834] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-neonRose border border-white animate-pulse shadow-[0_0_12px_#f43f5e]" />
                <span className="text-[11px] font-mono font-bold text-neonRose">BOOYAH // CLUTCH WIN</span>
              </div>
              <span className="text-[10px] font-mono text-iceSilver-dark">VICTORY ZONE</span>
            </div>

            <div className="my-auto text-center space-y-3 p-4 rounded-xl bg-black/80 border border-[#242834]">
              <Sparkles className="w-8 h-8 text-marigold mx-auto animate-bounce" />
              <h5 className="font-bold text-iceSilver font-grotesk text-lg">TEAM UP FOR THE WIN</h5>
              <p className="text-xs font-mono text-iceSilver-dark leading-relaxed">
                Looking for a high-intensity developer with razor-sharp reflexes and full-stack battle expertise?
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-marigold to-neonRose text-black font-mono text-xs font-bold shadow-lg shadow-marigold/20 transition-transform active:scale-95"
              >
                <span>SQUAD UP (CONTACT)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="text-[10px] font-mono text-iceSilver-dark text-center border-t border-[#242834] pt-2">
              READY FOR RANKED OPPORTUNITIES
            </div>
          </div>

        </div>

        {/* ─── TACTICAL LASER RUNNER BED ─── */}
        <div className="w-full relative mt-4 pointer-events-none">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-marigold to-neonRose shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
          <div className="w-full h-3 bg-gradient-to-b from-[#08080a] to-transparent opacity-90" />
        </div>

      </div>

      {/* Guidance */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 pt-2 font-mono text-[11px] text-iceSilver-dark">
        <span className="flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-marigold" />
          <span>Hover over any mission card to pause and inspect · Drag or swipe horizontally to navigate</span>
        </span>

        <Link to="/work" className="text-marigold hover:underline flex items-center gap-1 font-bold">
          <span>View Complete Operations Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
