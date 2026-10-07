import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon, Gamepad2, GraduationCap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useScrollDirection } from '../../hooks/useScrollDirection';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mainLinks = [
    { name: 'ABOUT', href: '/about' },
    { name: 'WORK', href: '/work' },
    { name: 'EXPERIENCE', href: '/experience' },
    { name: 'SKILLS', href: '/skills' },
  ];

  const moreLinks = [
    { name: 'Notes & Journal', href: '/notes' },
    { name: 'Now & Currently', href: '/now' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'Achievements & Honors', href: '/achievements' },
    { name: 'Playground', href: '/playground' },
  ];

  const secondaryLinks = [
    { name: 'RESUME', href: '/resume' },
    { name: 'CONTACT', href: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const { scrollDirection, isScrolled } = useScrollDirection();
  
  // Navbar hides on scroll down (if past top), shows on scroll up
  const navTransform = scrollDirection === 'down' && isScrolled ? '-translate-y-full' : 'translate-y-0';
  const navBackground = isScrolled ? 'bg-[#0d0d0d]/95 shadow-lg backdrop-blur-xl' : 'bg-transparent';

  return (
    <nav className={`fixed top-0 w-full z-50 border-b border-editorial-border transition-all duration-300 ease-editorial flex items-center ${isScrolled ? 'h-14' : 'h-20'} ${navTransform} ${navBackground}`}>
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold font-grotesk tracking-widest text-white hover:text-editorial-accent transition-colors flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-editorial-accent" />
          SIVA REDDY
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {mainLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* More Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`nav-link flex items-center gap-1 ${moreLinks.some(l => isActive(l.href)) ? 'active' : ''}`}
            >
              MORE <ChevronDown className="w-3 h-3" />
            </button>
            
            {moreDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#0d0d0d] border border-editorial-border shadow-2xl py-2 flex flex-col z-50">
                {moreLinks.map(link => (
                  <Link 
                    key={link.name}
                    to={link.href}
                    className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-editorial-textMuted hover:text-editorial-accent hover:bg-editorial-surface transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-editorial-border mx-3"></div>
          
          {secondaryLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}

          {/* Playground / Mode Controls */}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-editorial-border">
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-editorial-textMain hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#0d0d0d] border-b border-editorial-border md:hidden flex flex-col px-6 py-6 space-y-6 shadow-2xl h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-col space-y-4">
            <div className="text-xs font-mono text-editorial-textMuted uppercase tracking-widest border-b border-editorial-border pb-2">Main</div>
            {mainLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`text-sm font-mono tracking-widest uppercase ${isActive(link.href) ? 'text-editorial-accent' : 'text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="text-xs font-mono text-editorial-textMuted uppercase tracking-widest border-b border-editorial-border pb-2">Explore</div>
            {moreLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`text-sm font-mono tracking-widest uppercase ${isActive(link.href) ? 'text-editorial-accent' : 'text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col space-y-4">
            <div className="text-xs font-mono text-editorial-textMuted uppercase tracking-widest border-b border-editorial-border pb-2">Connect</div>
            {secondaryLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`text-sm font-mono tracking-widest uppercase ${isActive(link.href) ? 'text-editorial-accent' : 'text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
