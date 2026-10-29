import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Gamepad2, Flame } from 'lucide-react';
import { useScrollDirection } from '../../hooks/useScrollDirection';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const allNavLinks = [
    { name: 'ABOUT', href: '/about' },
    { name: 'WORK', href: '/work', badge: 'PRO' },
    { name: 'EXPERIENCE', href: '/experience' },
    { name: 'SKILLS', href: '/skills' },
    { name: 'CERTIFICATIONS', href: '/certifications' },
    { name: 'ACHIEVEMENTS', href: '/achievements' },
    { name: 'PLAYGROUND', href: '/playground', icon: Gamepad2, badge: 'GAMES' },
    { name: 'NOTES', href: '/notes' },
    { name: 'NOW', href: '/now' },
    { name: 'RESUME', href: '/resume' },
    { name: 'CONTACT', href: '/contact', isCta: true },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const { scrollDirection, isScrolled } = useScrollDirection();
  
  // Navbar background
  const navTransform = scrollDirection === 'down' && isScrolled ? '-translate-y-full' : 'translate-y-0';
  const navBackground = isScrolled ? 'bg-[#08080a]/95 shadow-[0_4px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl border-[#242834]' : 'bg-[#08080a]/75 backdrop-blur-md border-[#242834]/60';

  return (
    <nav className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ease-editorial flex items-center ${isScrolled ? 'h-14' : 'h-16 lg:h-18'} ${navTransform} ${navBackground}`}>
      <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        
        {/* Logo with Free Fire Flame Vibe */}
        <Link to="/" className="text-base sm:text-lg font-bold font-grotesk tracking-widest text-iceSilver hover:text-marigold transition-colors flex items-center gap-2.5 shrink-0 group">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-marigold to-neonRose text-black shadow-md shadow-marigold/20 group-hover:scale-110 transition-transform">
            <Flame className="w-4 h-4 fill-black" />
          </div>
          <span className="bg-gradient-to-r from-iceSilver via-white to-marigold bg-clip-text text-transparent font-extrabold">
            SIVA REDDY
          </span>
        </Link>

        {/* Desktop Nav - Displaying ALL Sections directly with Theme Colors */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto no-scrollbar py-1">
          {allNavLinks.map(link => {
            const active = isActive(link.href);
            const Icon = link.icon;
            
            if (link.isCta) {
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`ml-2 px-3.5 py-1.5 rounded-md text-[11px] xl:text-xs font-mono uppercase tracking-wider font-bold transition-all duration-200 shadow-md ${
                    active
                      ? 'bg-gradient-to-r from-marigold to-neonRose text-black shadow-marigold/30'
                      : 'bg-gradient-to-r from-marigold to-neonRose text-black hover:opacity-90 hover:scale-105 active:scale-95'
                  }`}
                >
                  {link.name}
                </Link>
              );
            }

            return (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`relative px-2 xl:px-2.5 py-1 text-[11px] xl:text-xs font-mono uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                  active 
                    ? 'text-white font-bold' 
                    : 'text-iceSilver-dark hover:text-iceSilver'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-neonRose" />}
                <span>{link.name}</span>
                {link.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    link.badge === 'PRO' 
                      ? 'bg-marigold/15 text-marigold border border-marigold/40' 
                      : 'bg-neonRose/15 text-neonRose border border-neonRose/40'
                  }`}>
                    {link.badge}
                  </span>
                )}
                {/* Active Underline Indicator with Marigold to Neon Rose gradient */}
                <span 
                  className={`absolute -bottom-1 left-2 right-2 h-[2px] transition-all duration-200 ${
                    active ? 'bg-gradient-to-r from-marigold to-neonRose opacity-100 scale-x-100 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-transparent opacity-0 scale-x-0'
                  }`} 
                />
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-3">
          <Link
            to="/contact"
            className="px-3 py-1 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-marigold to-neonRose text-black"
          >
            CONTACT
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-iceSilver hover:text-white p-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-iceSilver" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu - All 11 Sections Visible */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#08080a] border-b border-[#242834] lg:hidden flex flex-col px-6 py-6 space-y-4 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="text-xs font-mono text-iceSilver-dark uppercase tracking-widest border-b border-[#242834] pb-2 flex items-center justify-between">
            <span>Portfolio Sections</span>
            <span className="text-marigold font-bold">11 SECTIONS</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {allNavLinks.map((link, idx) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`p-2.5 rounded-lg border text-xs font-mono tracking-wider uppercase flex items-center justify-between transition-all ${
                    active 
                      ? 'border-marigold bg-marigold/10 text-marigold font-bold shadow-sm' 
                      : 'border-[#242834] bg-[#101016] text-iceSilver hover:text-white hover:border-iceSilver-dark'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] text-iceSilver-dark font-mono">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    {Icon && <Icon className="w-3.5 h-3.5 text-neonRose" />}
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${
                      link.badge === 'PRO'
                        ? 'bg-marigold/15 text-marigold border-marigold/40'
                        : 'bg-neonRose/15 text-neonRose border-neonRose/40'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
