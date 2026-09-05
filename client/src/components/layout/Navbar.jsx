import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, ArrowLeft, Github, Linkedin, Sparkles, Eye, Sun, Moon } from 'lucide-react';
import { useMode } from '../../context/ModeContext';
import { useTheme } from '../../context/ThemeContext';
import { useAnalytics } from '../../context/AnalyticsContext';
import { useProfileModal } from '../../context/ProfileModalContext';
import { getProfile, resolveMediaUrl } from '../../services/api';

const Navbar = () => {
  const { trackInteraction } = useAnalytics();
  const { openProfile } = useProfileModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('/Avatar.png');
  const [activeSection, setActiveSection] = useState('');
  const { isPlayMode, togglePlayMode } = useMode();
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    fetchProfileImage();
  }, []);

  // Active section observer on scroll
  useEffect(() => {
    if (isAdmin || location.pathname !== '/') return;

    const sections = ['about', 'projects', 'experiments', 'skills', 'experience', 'workspace', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, isAdmin]);

  const fetchProfileImage = async () => {
    try {
      const res = await getProfile();
      if (res.data?.data?.profileImage) {
        setProfileImage(resolveMediaUrl(res.data.data.profileImage));
      }
    } catch (e) {
      // Use fallback Avatar.png
    }
  };

  const navLinks = [
    { name: 'About',      id: 'about',       href: '/#about' },
    { name: 'Projects',   id: 'projects',    href: '/#projects' },
    { name: 'Lab',        id: 'experiments', href: '/#experiments' },
    { name: 'Skills',     id: 'skills',      href: '/#skills' },
    { name: 'Experience', id: 'experience',  href: '/#experience' },
    { name: 'Workspace',  id: 'workspace',   href: '/#workspace' },
    { name: 'Contact',    id: 'contact',     href: '/#contact' },
  ];

  const handleNavClick = (e, href) => {
    const targetId = href.replace('/#', '').replace('#', '');
    const element = document.getElementById(targetId);
    if (element && location.pathname === '/') {
      e.preventDefault();
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // ── Adaptive button styles for Tier-1 nav bg ──────────────────────────
  const adaptiveBtn = {
    background: isDark ? 'rgba(9,9,11,0.65)' : 'rgba(255,255,255,0.6)',
    borderColor: isDark ? 'rgba(63,63,70,0.7)' : 'rgba(100,116,139,0.35)',
  };

  // ── Shared icon controls block (theme + play + social + admin) ─────────
  const ActionControls = () => (
    <div className="flex items-center gap-1.5">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-xl border transition-all duration-200 active:scale-95"
        style={{
          ...adaptiveBtn,
          borderColor: isDark ? 'rgba(250,204,21,0.4)' : 'rgba(250,204,21,0.55)',
          boxShadow: '0 0 8px rgba(250,204,21,0.1)',
        }}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
      </button>

      {/* Play/Focus toggle */}
      <button
        onClick={togglePlayMode}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 active:scale-95"
        style={isPlayMode ? {
          background: 'rgba(250,204,21,0.15)',
          borderColor: 'rgba(250,204,21,0.5)',
          color: '#facc15',
          boxShadow: '0 0 14px rgba(250,204,21,0.25)',
        } : {
          ...adaptiveBtn,
          color: isDark ? 'rgba(255,255,255,0.65)' : '#475569',
        }}
        title="Toggle Play Mode"
      >
        {isPlayMode
          ? <><Sparkles className="w-3.5 h-3.5 text-amber-400" /><span className="font-bold">PLAY</span></>
          : <><Eye className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" /><span>FOCUS</span></>
        }
      </button>

      <div className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-0.5" />

      {/* GitHub */}
      <a
        href="https://github.com/vasanreddy"
        target="_blank" rel="noreferrer"
        onClick={() => trackInteraction('github_click', 'Navbar GitHub', 'Navigation')}
        className="p-2 rounded-xl border border-transparent text-slate-600 dark:text-white/55 hover:text-slate-900 dark:hover:text-white hover:border-slate-300/60 dark:hover:border-zinc-700/80 hover:bg-slate-200/50 dark:hover:bg-zinc-800/60 transition-all duration-200"
        aria-label="GitHub"
      >
        <Github className="w-4 h-4" />
      </a>

      {/* LinkedIn */}
      <a
        href="https://www.linkedin.com/in/venkatasiva-reddy/"
        target="_blank" rel="noreferrer"
        onClick={() => trackInteraction('linkedin_click', 'Navbar LinkedIn', 'Navigation')}
        className="p-2 rounded-xl border border-transparent text-slate-600 dark:text-white/55 hover:text-slate-900 dark:hover:text-white hover:border-slate-300/60 dark:hover:border-zinc-700/80 hover:bg-slate-200/50 dark:hover:bg-zinc-800/60 transition-all duration-200"
        aria-label="LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      {/* Admin */}
      <Link
        to="/admin"
        className="p-2 rounded-xl border border-transparent text-slate-500 dark:text-white/35 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-400/40 hover:bg-purple-500/10 transition-all duration-200"
        aria-label="Admin Space"
        title="Admin Dashboard"
      >
        <Terminal className="w-4 h-4" />
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 glass-nav w-full transition-all duration-300">
      <div className="section-container">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* ── Brand ────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2.5 shrink-0 min-w-0">
            {/* Profile avatar */}
            <button
              type="button"
              onClick={() => openProfile(profileImage)}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 cursor-pointer shrink-0 transition-all duration-300 active:scale-95"
              style={{ borderColor: 'rgba(74,222,128,0.55)', boxShadow: '0 0 12px rgba(74,222,128,0.2)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4ade80';
                e.currentTarget.style.boxShadow = '0 0 22px rgba(74,222,128,0.42)';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(74,222,128,0.55)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(74,222,128,0.2)';
                e.currentTarget.style.transform = 'none';
              }}
              title="Click to view full profile photo"
              aria-label="View full profile photo"
            >
              <img
                src={profileImage}
                alt="Venkata Siva Reddy"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/Avatar.png'; }}
              />
            </button>

            {/* Name + role */}
            <Link to="/" className="flex flex-col group min-w-0">
              <span className="font-extrabold text-[11px] sm:text-sm tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-200 leading-tight truncate">
                VENKATA SIVA REDDY
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-600 dark:text-white/50 tracking-wide leading-none mt-0.5 truncate">
                Software Engineer
              </span>
            </Link>
          </div>

          {/* ─────────────────────────────────────────────────────────── */}

          {!isAdmin ? (
            <>
              {/* ── Desktop (> 1024px / lg): all nav links + all controls inline ── */}
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`px-3 py-1.5 text-xs font-mono rounded-xl transition-all duration-200 border ${
                        isActive
                          ? 'font-bold'
                          : 'border-transparent text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 hover:border-slate-300/60 dark:hover:border-zinc-700/80'
                      }`}
                      style={isActive ? {
                        background: 'linear-gradient(135deg, rgba(74,222,128,0.18), rgba(56,189,248,0.18))',
                        borderColor: 'rgba(56,189,248,0.5)',
                        color: '#38bdf8',
                        boxShadow: '0 0 14px rgba(56,189,248,0.22)',
                      } : {}}
                    >
                      {link.name}
                    </a>
                  );
                })}

                <div className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-1" />
                <ActionControls />
              </nav>

              {/* ── Tablet (768px–1024px / md–lg): action controls + sections hamburger ── */}
              <div className="hidden md:flex lg:hidden items-center gap-1.5">
                <ActionControls />

                <div className="w-px h-4 bg-slate-300 dark:bg-zinc-700 mx-0.5" />

                {/* Sections-only hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 active:scale-95"
                  style={mobileMenuOpen ? {
                    background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(56,189,248,0.15))',
                    borderColor: 'rgba(56,189,248,0.45)',
                    color: '#38bdf8',
                    boxShadow: '0 0 12px rgba(56,189,248,0.18)',
                  } : {
                    ...adaptiveBtn,
                    color: isDark ? 'rgba(255,255,255,0.7)' : '#334155',
                  }}
                  aria-label="Toggle sections menu"
                >
                  {mobileMenuOpen
                    ? <><X className="w-4 h-4" /><span>Sections</span></>
                    : <><Menu className="w-4 h-4" /><span>Sections</span></>
                  }
                </button>
              </div>

              {/* ── Mobile (< 768px / < md): compact controls + hamburger ─────────── */}
              <div className="flex md:hidden items-center gap-1.5">
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl border transition-all duration-200 active:scale-95"
                  style={{ ...adaptiveBtn, borderColor: isDark ? 'rgba(250,204,21,0.4)' : 'rgba(250,204,21,0.55)' }}
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                </button>

                {/* Play/Focus */}
                <button
                  onClick={togglePlayMode}
                  className="p-2 rounded-xl border active:scale-95 transition-all duration-200"
                  style={isPlayMode ? {
                    background: 'rgba(250,204,21,0.15)',
                    borderColor: 'rgba(250,204,21,0.5)',
                    boxShadow: '0 0 10px rgba(250,204,21,0.2)',
                  } : adaptiveBtn}
                >
                  {isPlayMode
                    ? <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    : <Eye className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                  }
                </button>

                {/* Hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2.5 rounded-xl border transition-all duration-200 active:scale-95"
                  style={adaptiveBtn}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen
                    ? <X className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    : <Menu className="w-5 h-5 text-slate-700 dark:text-zinc-200" />
                  }
                </button>
              </div>
            </>
          ) : (
            /* Admin mode: Back to Portfolio button */
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all duration-200 active:scale-95"
              style={{
                background: isDark ? 'rgba(9,9,11,0.8)' : 'rgba(255,255,255,0.65)',
                borderColor: isDark ? 'rgba(63,63,70,0.65)' : 'rgba(100,116,139,0.3)',
                color: isDark ? '#fff' : '#1e293b',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.boxShadow = '0 0 16px rgba(56,189,248,0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? 'rgba(63,63,70,0.65)' : 'rgba(100,116,139,0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Link>
          )}

        </div>
      </div>

      {/* ── Dropdown Drawer (sections only — used by both mobile & tablet) ── */}
      {mobileMenuOpen && !isAdmin && (
        <div className="border-b border-slate-300/50 dark:border-zinc-800/70 bg-[#cfd5de]/98 dark:bg-[#03030a]/98 backdrop-blur-2xl animate-fade-in">
          <div className="section-container py-4 space-y-1">

            {/* Section nav links */}
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center px-4 py-2.5 text-sm font-mono rounded-xl transition-all duration-200 border ${
                    isActive
                      ? 'font-bold'
                      : 'border-transparent text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 hover:border-slate-300/60 dark:hover:border-zinc-700/60'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(56,189,248,0.15))',
                    borderColor: 'rgba(56,189,248,0.45)',
                    color: '#38bdf8',
                    boxShadow: '0 0 12px rgba(56,189,248,0.18)',
                  } : {}}
                >
                  {link.name}
                </a>
              );
            })}

            {/* Mobile-only: social + admin (hidden on tablet/desktop since those are inline) */}
            <div className="md:hidden">
              <div className="h-px bg-slate-300/70 dark:bg-zinc-800/80 my-2" />
              <div className="flex items-center justify-between px-1 pt-1">
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/vasanreddy"
                    target="_blank" rel="noreferrer"
                    onClick={() => trackInteraction('github_click', 'Mobile Navbar GitHub', 'Navigation')}
                    className="p-2.5 rounded-xl border text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400/50 dark:hover:border-sky-500/50 hover:bg-slate-200/50 dark:hover:bg-zinc-800/60 transition-all duration-200"
                    style={{ borderColor: isDark ? 'rgba(63,63,70,0.65)' : 'rgba(100,116,139,0.3)' }}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/venkatasiva-reddy/"
                    target="_blank" rel="noreferrer"
                    onClick={() => trackInteraction('linkedin_click', 'Mobile Navbar LinkedIn', 'Navigation')}
                    className="p-2.5 rounded-xl border text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400/50 dark:hover:border-sky-500/50 hover:bg-slate-200/50 dark:hover:bg-zinc-800/60 transition-all duration-200"
                    style={{ borderColor: isDark ? 'rgba(63,63,70,0.65)' : 'rgba(100,116,139,0.3)' }}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono rounded-xl border border-purple-400/40 bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition-all"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Admin mobile drawer */}
      {mobileMenuOpen && isAdmin && (
        <div className="md:hidden border-b border-slate-300/50 dark:border-zinc-800/70 bg-[#cfd5de]/98 dark:bg-[#03030a]/98 backdrop-blur-2xl animate-fade-in">
          <div className="section-container py-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-mono text-slate-700 dark:text-white/80"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
