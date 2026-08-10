import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, ArrowLeft, Github, Linkedin, Sparkles, Eye, Sun, Moon } from 'lucide-react';
import { useMode } from '../../context/ModeContext';
import { useTheme } from '../../context/ThemeContext';
import { getProfile, resolveMediaUrl } from '../../services/api';

const Navbar = () => {
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

    const sections = ['about', 'projects', 'experiments', 'skills', 'experience', 'contact'];
    
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
          
          {/* Brand Identity with Profile Photo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-indigo-500/40 group-hover:border-indigo-500 shadow-md transition-all duration-200 shrink-0 bg-slate-200 dark:bg-zinc-800">
              <img
                src={profileImage}
                alt="Venkata Siva Reddy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = '/Avatar.png'; }}
              />
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200 leading-tight">
                VENKATA SIVA REDDY
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-white/50 tracking-wide leading-none mt-0.5">
                Software Engineer
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {!isAdmin ? (
              <>
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;

                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`px-3.5 py-2 text-xs font-mono rounded-lg transition-all duration-200 relative ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/10'
                          : 'text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-zinc-800/40'
                      }`}
                    >
                      {link.name}
                    </a>
                  );
                })}

                <div className="w-px h-4 bg-slate-200 dark:bg-zinc-800 mx-2" />

                {/* Theme Switcher Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 text-slate-700 dark:text-white/70 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all duration-200 active:scale-95 shadow-sm"
                  title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                </button>

                {/* Focus / Play Mode Toggle */}
                <button
                  onClick={togglePlayMode}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-200 active:scale-95 ${
                    isPlayMode 
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300 shadow-sm' 
                      : 'border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Toggle Play Mode for micro-interactions"
                >
                  {isPlayMode ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>PLAY</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>FOCUS</span>
                    </>
                  )}
                </button>

                <div className="w-px h-4 bg-slate-200 dark:bg-zinc-800 mx-2" />

                <a
                  href="https://github.com/vasanreddy"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/venkatasiva-reddy/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                <Link
                  to="/admin"
                  className="ml-1 p-2 text-slate-400 dark:text-white/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  aria-label="Admin Space"
                  title="Admin Dashboard"
                >
                  <Terminal className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
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
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-slate-700 dark:text-white/70 active:scale-95"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={togglePlayMode}
              className={`p-2 rounded-xl border text-xs active:scale-95 ${
                isPlayMode ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300' : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50'
              }`}
            >
              {isPlayMode ? <Sparkles className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-slate-700 dark:text-white/80 active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-zinc-800 bg-slate-50/98 dark:bg-[#09090c]/98 backdrop-blur-2xl animate-fade-in">
          <div className="section-container py-6 space-y-3">
            {!isAdmin ? (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block px-4 py-3 text-sm font-mono text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}

                <div className="h-px bg-slate-200 dark:bg-zinc-800/80 my-3" />

                <div className="flex items-center justify-between px-2 pt-2">
                  <div className="flex items-center gap-3">
                    <a
                      href="https://github.com/vasanreddy"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/venkatasiva-reddy/"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-slate-600 dark:text-white/50 hover:text-indigo-600 dark:hover:text-indigo-400"
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
