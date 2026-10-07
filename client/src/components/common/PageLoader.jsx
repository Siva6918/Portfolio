import React, { useEffect, useState, useRef } from 'react';

/* ────────────────────────────────────────────
   Shared Shell
──────────────────────────────────────────── */
const Shell = ({ accent = '#d94e34', progress, exiting, title, icon, children }) => (
  <div
    className={`fixed inset-0 z-[9998] flex items-center justify-center transition-opacity duration-350 ${
      exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}
    style={{ background: '#0d0d0d' }}
  >
    {/* Progress bar */}
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5">
      <div className="h-full transition-all duration-200 ease-out" style={{ width: `${progress}%`, background: accent }} />
      <div className="absolute top-0 h-[2px] w-20 blur-sm transition-all duration-200" style={{
        left: `max(0px, ${progress}% - 80px)`, background: accent,
      }} />
    </div>

    <div className="w-full max-w-sm mx-4 bg-[#111318] border border-white/[0.07] rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/[0.05] bg-[#0e1117]">
        <span className="text-base">{icon}</span>
        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: `${accent}bb` }}>{title}</span>
        <div className="ml-auto flex gap-1.5">
          {[0,1,2].map(i => (
            <span key={i} className="w-1 h-1 rounded-full" style={{
              background: accent,
              animation: `softPulse 1s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 font-mono text-[12px] leading-7 min-h-[150px] flex flex-col justify-center">
        {children}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/[0.05] bg-[#0e1117] flex justify-between">
        <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">loading…</span>
        <span className="font-mono text-[9px]" style={{ color: accent }}>{progress}%</span>
      </div>
    </div>
  </div>
);

/* Shared hooks */
function useSteps(count, ms = 220) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const ts = Array.from({ length: count }, (_, i) => setTimeout(() => setStep(i + 1), i * ms));
    return () => ts.forEach(clearTimeout);
  }, []);
  return step;
}
function useTyped(text, speed = 38) {
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { setTyped(text.slice(0, ++i)); if (i >= text.length) clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, []);
  return typed;
}

/* ────────────────────────────────────────────
   ROUTE-SPECIFIC LOADERS
──────────────────────────────────────────── */

// /about — Bio card building
const AboutLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(5, 200);
  const fields = [
    ['name', '"Venkata Siva Reddy"', '#c3e88d'],
    ['role', '"Full Stack Developer"', '#82aaff'],
    ['location', '"India 🇮🇳"', '#c3e88d'],
    ['degree', '"B.Tech Computer Science"', '#c3e88d'],
    ['status', '"Open to opportunities"', '#27c93f'],
  ];
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="about.json" icon="👤">
      <p style={{ color: '#c792ea' }}>{'{'}</p>
      {fields.slice(0, step).map(([k, v, c], i) => (
        <p key={i} className="pl-4">
          <span style={{ color: '#f78c6c' }}>"{k}"</span>
          <span style={{ color: '#cdd3de' }}>: </span>
          <span style={{ color: c }}>{v}</span>
          {i < 4 && <span style={{ color: '#cdd3de' }}>,</span>}
        </p>
      ))}
      {step === 5 && <p style={{ color: '#c792ea' }}>{'}'}</p>}
    </Shell>
  );
};

// /work — Project file tree
const WorkLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(5, 200);
  const files = ['📁 projects/', '  ├─ nutricloud-monitor.jsx', '  ├─ docspot-booking.jsx', '  ├─ candidate-rank.tsx', '  └─ weather-app.jsx'];
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="projects/" icon="📂">
      {files.slice(0, step).map((f, i) => (
        <p key={i} style={{ color: i === 0 ? accent : i === step - 1 ? '#cdd3de' : '#ffffff55' }}>{f}</p>
      ))}
      {step === 5 && <p className="mt-1" style={{ color: '#27c93f' }}>✓ 4 projects indexed</p>}
    </Shell>
  );
};

// /work/:slug — Opening a project file
const ProjectDetailLoader = ({ accent, progress, exiting }) => {
  const text = useTyped('Opening project details…', 40);
  const step = useSteps(3, 300);
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="project.jsx" icon="🔍">
      <p style={{ color: '#82aaff' }}>$ <span style={{ color: '#cdd3de' }}>{text}</span><span className="animate-pulse">▌</span></p>
      {step >= 2 && <p style={{ color: '#ffffff55' }}>Reading metadata…</p>}
      {step >= 2 && <p style={{ color: '#c3e88d' }}>→ tech stack loaded</p>}
      {step >= 3 && <p style={{ color: '#27c93f' }}>→ screenshots ready</p>}
    </Shell>
  );
};

// /experience — Timeline entries
const ExperienceLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(4, 230);
  const entries = [
    ['2024–Now ', 'Software Dev Intern'],
    ['2023–2024', 'ML Research Assist.'],
    ['2022–2023', 'Web Dev Project Lead'],
    ['2021–2022', 'Open Source Contrib.'],
  ];
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="experience.timeline" icon="💼">
      <p style={{ color: '#ffffff33' }}>// career timeline</p>
      {entries.slice(0, step).map(([yr, role], i) => (
        <p key={i} className="flex gap-3" style={{ color: i === step - 1 ? '#cdd3de' : '#ffffff44' }}>
          <span style={{ color: accent }}>{yr}</span>
          <span>→</span>
          <span>{role}</span>
        </p>
      ))}
    </Shell>
  );
};

// /skills — Skill bars filling
const SkillsLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(5, 190);
  const skills = [
    ['React', 92], ['Node.js', 88], ['Python', 82], ['TypeScript', 78], ['AWS', 70],
  ];
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="skills.map()" icon="⚡">
      {skills.slice(0, step).map(([name, pct], i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-20 text-[11px]" style={{ color: i === step - 1 ? '#cdd3de' : '#ffffff55' }}>{name}</span>
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: i < step ? `${pct}%` : '0%', background: accent }}
            />
          </div>
          <span className="text-[10px]" style={{ color: accent }}>{i < step ? pct + '%' : ''}</span>
        </div>
      ))}
    </Shell>
  );
};

// /certifications — Validating credentials
const CertificationsLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(4, 240);
  const certs = ['AWS Cloud Practitioner', 'Meta React Certificate', 'Google UX Design', 'freeCodeCamp Algorithms'];
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="verify-certs.sh" icon="🎓">
      <p style={{ color: '#ffffff44' }}>$ verify --all --strict</p>
      {certs.slice(0, step).map((c, i) => (
        <p key={i} style={{ color: i < step - 1 ? '#27c93f' : accent }}>
          {i < step - 1 ? '✓ ' : '⟳ '}{c}
        </p>
      ))}
    </Shell>
  );
};

// /achievements — Unlocking trophies
const AchievementsLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(4, 230);
  const items = ['🏆 Hackathon Winner', '⭐ Top Contributor', '🚀 Product Launch', '🎯 Open Source 50★'];
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="achievements.log" icon="🏅">
      <p style={{ color: '#ffffff33' }}>// loading records…</p>
      {items.slice(0, step).map((a, i) => (
        <p key={i} className="transition-all duration-300" style={{
          opacity: i < step ? 1 : 0,
          transform: i < step ? 'translateX(0)' : 'translateX(-8px)',
          color: i === step - 1 ? '#cdd3de' : '#ffffff55',
        }}>{a}</p>
      ))}
    </Shell>
  );
};

// /notes — Blog rendering
const NotesLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(4, 230);
  const posts = ['# Building AI Agents with LangChain', '# React Performance Patterns', '# AWS Serverless Guide', '# TypeScript Deep Dive'];
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="notes.md" icon="📝">
      <p style={{ color: '#ffffff33' }}>Rendering markdown…</p>
      {posts.slice(0, step).map((p, i) => (
        <p key={i} style={{ color: i === step - 1 ? accent : '#ffffff44', fontSize: '11px' }}>
          {p.length > 36 ? p.slice(0, 36) + '…' : p}
        </p>
      ))}
    </Shell>
  );
};

// /notes/:slug — Reading article
const BlogPostLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(4, 230);
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="article.md" icon="📖">
      {step >= 1 && <p style={{ color: accent }}># Loading article…</p>}
      {step >= 2 && <p style={{ color: '#ffffff44' }}>→ Parsing markdown</p>}
      {step >= 3 && <p style={{ color: '#ffffff44' }}>→ Highlighting code blocks</p>}
      {step >= 4 && <p style={{ color: '#27c93f' }}>→ Ready to read</p>}
    </Shell>
  );
};

// /contact — Compose message
const ContactLoader = ({ accent, progress, exiting }) => {
  const text = useTyped('Composing message channel…', 42);
  const step = useSteps(3, 320);
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="contact.smtp" icon="✉️">
      <p style={{ color: '#82aaff' }}>HELO mail.siva.dev</p>
      {step >= 1 && <p style={{ color: '#ffffff55' }}>EHLO: encryption TLS 1.3</p>}
      {step >= 2 && <p style={{ color: '#cdd3de' }}>RCPT TO: &lt;siva@portfolio&gt;</p>}
      {step >= 3 && <p style={{ color: '#27c93f' }}>250 OK · Channel ready</p>}
    </Shell>
  );
};

// /resume — PDF generating
const ResumeLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(5, 190);
  const sections = ['Header & Contact', 'Education', 'Experience', 'Projects', 'Skills'];
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="resume.pdf" icon="📄">
      <p style={{ color: '#ffffff33' }}>$ generate-pdf --format A4</p>
      {sections.slice(0, step).map((s, i) => (
        <p key={i} style={{ color: i < step - 1 ? '#27c93f' : accent }}>
          {i < step - 1 ? '✓' : '⟳'} Rendering: {s}
        </p>
      ))}
    </Shell>
  );
};

// /now — Live status
const NowLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(4, 230);
  const d = new Date();
  const items = [
    `date: "${d.toLocaleDateString()}"`,
    'building: "AI Portfolio"',
    'learning: "AWS Advanced"',
    'mood: "in the zone 🎯"',
  ];
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="now.status" icon="🟢">
      <p style={{ color: '#c792ea' }}>const <span style={{ color: '#82aaff' }}>status</span> = {'{'}</p>
      {items.slice(0, step).map((item, i) => (
        <p key={i} className="pl-4" style={{ color: i === step - 1 ? '#cdd3de' : '#ffffff44' }}>
          {item}{i < 3 ? ',' : ''}
        </p>
      ))}
      {step === 4 && <p style={{ color: '#c792ea' }}>{'}'}</p>}
    </Shell>
  );
};

// /playground — Sandbox boot
const PlaygroundLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(5, 190);
  const lines = ['🔧 Booting sandbox…', '🎨 Loading canvas API', '⚡ Wiring event handlers', '🧪 Running experiments', '🚀 Playground ready!'];
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="sandbox.dev" icon="🧪">
      {lines.slice(0, step).map((l, i) => (
        <p key={i} style={{ color: i === step - 1 ? (i === 4 ? '#27c93f' : accent) : '#ffffff44' }}>{l}</p>
      ))}
    </Shell>
  );
};

// Default fallback loader
const DefaultLoader = ({ accent, progress, exiting }) => {
  const step = useSteps(3, 280);
  return (
    <Shell accent={accent} progress={progress} exiting={exiting} title="page.jsx" icon="⚙️">
      {step >= 1 && <p style={{ color: '#cdd3de' }}>import Page <span style={{ color: '#ffffff44' }}>from './routes'</span></p>}
      {step >= 2 && <p style={{ color: accent }}>const Component = await load()</p>}
      {step >= 3 && <p style={{ color: '#27c93f' }}>render(&lt;Component /&gt;) ✓</p>}
    </Shell>
  );
};

/* ────────────────────────────────────────────
   Route → Loader map
──────────────────────────────────────────── */
const ROUTE_MAP = {
  '/about':            { Loader: AboutLoader,           accent: '#82aaff' },
  '/work':             { Loader: WorkLoader,             accent: '#d94e34' },
  '/experience':       { Loader: ExperienceLoader,       accent: '#f78c6c' },
  '/skills':           { Loader: SkillsLoader,           accent: '#27c93f' },
  '/certifications':   { Loader: CertificationsLoader,   accent: '#ffbd2e' },
  '/achievements':     { Loader: AchievementsLoader,     accent: '#ffbd2e' },
  '/notes':            { Loader: NotesLoader,             accent: '#c3e88d' },
  '/contact':          { Loader: ContactLoader,           accent: '#d94e34' },
  '/resume':           { Loader: ResumeLoader,            accent: '#82aaff' },
  '/now':              { Loader: NowLoader,               accent: '#27c93f' },
  '/playground':       { Loader: PlaygroundLoader,        accent: '#c792ea' },
};

/* ────────────────────────────────────────────
   Main PageLoader
──────────────────────────────────────────── */
const PageLoader = ({ onDone, pathname = '/' }) => {
  // Match slug routes
  let route = pathname;
  if (pathname.startsWith('/work/')) route = '/work/:slug';
  if (pathname.startsWith('/notes/') && pathname !== '/notes') route = '/notes/:slug';

  const { Loader = DefaultLoader, accent = '#d94e34' } =
    route === '/work/:slug' ? { Loader: ProjectDetailLoader, accent: '#d94e34' } :
    route === '/notes/:slug' ? { Loader: BlogPostLoader, accent: '#c3e88d' } :
    ROUTE_MAP[route] || {};

  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let start = null;
    const totalMs = 1050;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / totalMs, 1);
      setProgress(Math.floor(p * 100));
      if (p < 1) requestAnimationFrame(tick);
      else {
        setTimeout(() => { setExiting(true); setTimeout(() => onDone?.(), 350); }, 150);
      }
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <Loader accent={accent} progress={progress} exiting={exiting} />;
};

export default PageLoader;
