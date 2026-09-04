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
    { name: 'About', id: 'about', href: '/#about' },
    { name: 'Projects', id: 'projects', href: '/#projects' },
    { name: 'Lab', id: 'experiments', href: '/#experiments' },
    { name: 'Skills', id: 'skills', href: '/#skills' },
    { name: 'Experience', id: 'experience', href: '/#experience' },
    { name: 'Workspace', id: 'workspace', href: '/#workspace' },
    { name: 'Contact', id: 'contact', href: '/#contact' },
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

  return (
    <header className="sticky top-0 z-50 glass-nav w-full transition-all duration-300">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Identity with Clickable Profile Photo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openProfile(profileImage)}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 cursor-pointer group shrink-0 transition-all duration-300 active:scale-95"
              style={{
                borderColor: 'rgba(74,222,128,0.5)',
                boxShadow: '0 0 16px rgba(74,222,128,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4ade80';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(74,222,128,0.45)';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(74,222,128,0.5)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(74,222,128,0.25)';
                e.currentTarget.style.transform = 'none';
              }}
              title="Click to view full profile photo"
              aria-label="View full profile photo"
            >
              <img
                src={profileImage}
                alt="Venkata Siva Reddy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = '/Avatar.png'; }}
              />
            </button>

            <Link to="/" className="flex flex-col group">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors duration-200 leading-tight">
                VENKATA SIVA REDDY
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-white/50 tracking-wide leading-none mt-0.5">
                Software Engineer
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {!isAdmin ? (
              <>
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;

                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`px-3.5 py-1.5 text-xs font-mono rounded-xl transition-all duration-200 border ${
                        isActive
                          ? 'font-bold'
                          : 'border-transparent text-slate-700 dark:text-zinc-400 hover:text-white hover:bg-zinc-800/60 hover:border-zinc-700/80'
                      }`}
                      style={isActive ? {
                        background: 'linear-gradient(135deg, rgba(74,222,128,0.18), rgba(56,189,248,0.18))',
                        borderColor: 'rgba(56,189,248,0.5)',
                        color: '#38bdf8',
                        boxShadow: '0 0 16px rgba(56,189,248,0.25)'
                      } : {}}
                    >
                      {link.name}
                    </a>
                  );
                })}

                <div className="w-px h-4 bg-slate-200 dark:bg-zinc-800 mx-1.5" />

                {/* Theme Switcher Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl border transition-all duration-200 active:scale-95 shadow-sm"
                  style={{
                    background: 'rgba(9,9,11,0.85)',
                    borderColor: 'rgba(250,204,21,0.35)',
                    boxShadow: '0 0 12px rgba(250,204,21,0.15)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#facc15'; e.currentTarget.style.boxShadow = '0 0 18px rgba(250,204,21,0.35)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(250,204,21,0.35)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(250,204,21,0.15)'; }}
                  title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                </button>

                {/* Focus / Play Mode Toggle */}
                <button
                  onClick={togglePlayMode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 active:scale-95"
                  style={isPlayMode ? {
                    background: 'rgba(250,204,21,0.15)',
                    borderColor: 'rgba(250,204,21,0.5)',
                    color: '#facc15',
                    boxShadow: '0 0 16px rgba(250,204,21,0.25)'
                  } : {
                    background: 'rgba(9,9,11,0.85)',
                    borderColor: 'rgba(63,63,70,0.65)',
                    color: 'rgba(255,255,255,0.7)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = isPlayMode ? '#facc15' : 'rgba(192,132,252,0.6)';
                    e.currentTarget.style.boxShadow = isPlayMode ? '0 0 20px rgba(250,204,21,0.35)' : '0 0 16px rgba(192,132,252,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isPlayMode ? 'rgba(250,204,21,0.5)' : 'rgba(63,63,70,0.65)';
                    e.currentTarget.style.boxShadow = isPlayMode ? '0 0 16px rgba(250,204,21,0.25)' : '0 2px 8px rgba(0,0,0,0.2)';
                  }}
                  title="Toggle Play Mode for micro-interactions"
                >
                  {isPlayMode ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                      <span className="font-bold">PLAY</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      <span>FOCUS</span>
                    </>
                  )}
                </button>

                <div className="w-px h-4 bg-slate-200 dark:bg-zinc-800 mx-1.5" />

                <a
                  href="https://github.com/vasanreddy"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackInteraction('github_click', 'Navbar GitHub', 'Navigation')}
                  className="p-2 rounded-xl border border-transparent text-slate-600 dark:text-white/60 hover:text-white hover:border-zinc-700/80 hover:bg-zinc-800/60 transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/venkatasiva-reddy/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackInteraction('linkedin_click', 'Navbar LinkedIn', 'Navigation')}
                  className="p-2 rounded-xl border border-transparent text-slate-600 dark:text-white/60 hover:text-white hover:border-zinc-700/80 hover:bg-zinc-800/60 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                <Link
                  to="/admin"
                  className="p-2 rounded-xl border border-transparent text-slate-400 dark:text-white/40 hover:text-purple-400 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all duration-200"
                  aria-label="Admin Space"
                  title="Admin Dashboard"
                >
                  <Terminal className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono text-white transition-all duration-200 active:scale-95 shadow-sm"
                style={{
                  background: 'rgba(9,9,11,0.85)',
                  borderColor: 'rgba(63,63,70,0.65)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.boxShadow = '0 0 16px rgba(56,189,248,0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(63,63,70,0.65)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Portfolio</span>
              </Link>
            )}
          </nav>

          {/* Mobile Navigation Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border transition-all duration-200 active:scale-95 shadow-sm"
              style={{
                background: 'rgba(9,9,11,0.85)',
                borderColor: 'rgba(250,204,21,0.35)',
                boxShadow: '0 0 12px rgba(250,204,21,0.15)'
              }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <button
              onClick={togglePlayMode}
              className="p-2 rounded-xl border text-xs active:scale-95 transition-all duration-200"
              style={isPlayMode ? {
                background: 'rgba(250,204,21,0.15)',
                borderColor: 'rgba(250,204,21,0.5)',
                boxShadow: '0 0 12px rgba(250,204,21,0.2)'
              } : {
                background: 'rgba(9,9,11,0.85)',
                borderColor: 'rgba(63,63,70,0.65)'
              }}
            >
              {isPlayMode ? <Sparkles className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border transition-all duration-200 active:scale-95 text-white"
              style={{
                background: 'rgba(9,9,11,0.85)',
                borderColor: 'rgba(63,63,70,0.65)'
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5 text-zinc-200" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-300/50 dark:border-zinc-800/70 bg-[#cfd5de]/98 dark:bg-[#03030a]/98 backdrop-blur-2xl animate-fade-in">
          <div className="section-container py-6 space-y-2.5">
            {!isAdmin ? (
              <>
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`block px-4 py-2.5 text-sm font-mono rounded-xl transition-all duration-200 border ${
                        isActive
                          ? 'font-bold'
                          : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/60 hover:border-zinc-700/80'
                      }`}
                      style={isActive ? {
                        background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(56,189,248,0.15))',
                        borderColor: 'rgba(56,189,248,0.45)',
                        color: '#38bdf8',
                        boxShadow: '0 0 14px rgba(56,189,248,0.2)'
                      } : {}}
                    >
                      {link.name}
                    </a>
                  );
                })}

                <div className="h-px bg-zinc-800/80 my-3" />

                <div className="flex items-center justify-between px-2 pt-2">
                  <div className="flex items-center gap-2.5">
                    <a
                      href="https://github.com/vasanreddy"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackInteraction('github_click', 'Mobile Navbar GitHub', 'Navigation')}
                      className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-sky-500/50 transition-all"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/venkatasiva-reddy/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackInteraction('linkedin_click', 'Mobile Navbar LinkedIn', 'Navigation')}
                      className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:border-sky-500/50 transition-all"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                </div>
              </>
            ) : (
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-mono text-slate-700 dark:text-white/80"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Portfolio</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
