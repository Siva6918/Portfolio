import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const mainLinks = [
    { name: 'WORK', href: '/work' },
    { name: 'ABOUT', href: '/about' },
    { name: 'NOTES', href: '/notes' },
    { name: 'NOW', href: '/now' },
  ];

  const secondaryLinks = [
    { name: 'RESUME', href: '/resume' },
    { name: 'CONTACT', href: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="nav-bar">
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold font-grotesk tracking-widest text-white hover:text-editorial-accent transition-colors">
          SIVA
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {mainLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <div className="w-px h-4 bg-editorial-border mx-4"></div>
          {secondaryLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-editorial-textMain hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#0d0d0d] border-b border-editorial-border md:hidden flex flex-col px-6 py-4 space-y-4 shadow-2xl">
          {mainLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`text-sm font-mono tracking-widest uppercase ${isActive(link.href) ? 'text-editorial-accent' : 'text-editorial-textMuted'}`}
            >
              {link.name}
            </Link>
          ))}
          <div className="w-full h-px bg-editorial-border"></div>
          {secondaryLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`text-sm font-mono tracking-widest uppercase ${isActive(link.href) ? 'text-editorial-accent' : 'text-editorial-textMuted'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
