import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Terminal, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const navLinks = [
    { name: 'Digital Campus', href: '/#digital-campus' },
    { name: 'Career Road', href: '/#career-road' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Certifications', href: '/#certifications' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav transition-colors w-full">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366f1] via-[#c084fc] to-[#06b6d4] p-[1px] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#09090b] rounded-[11px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-[#6366f1]" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-[#fafafa] group-hover:text-[#6366f1] transition-colors">
                VENKATA SIVA REDDY
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-[#a1a1aa] font-bold">
                Full Stack & Software Engineer
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {!isAdmin ? (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-xs font-semibold text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}

                {/* My Space Admin Button */}
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#6366f1]/15 hover:bg-[#6366f1]/30 text-[#6366f1] border border-[#6366f1]/30 hover:border-[#6366f1] transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>My Space</span>
                </Link>
              </>
            ) : (
              /* Return to Portfolio button */
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#6366f1]/10 hover:bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 text-[#6366f1]" />
                <span>Return to Portfolio</span>
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl bg-[#121217] border border-[#2d2d3a] text-[#fafafa] hover:scale-105 transition-all duration-300"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-200" />}
            </button>
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[#121217] text-[#fafafa]"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-200" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#121217] text-[#fafafa]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-modal border-t border-[#2d2d3a] px-6 py-6 space-y-4">
          {!isAdmin ? (
            <>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-bold text-[#a1a1aa] hover:text-[#fafafa] py-1"
                >
                  {link.name}
                </a>
              ))}

              {/* My Space Mobile Button */}
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/30 font-bold text-sm mt-2"
              >
                <Terminal className="w-4 h-4" />
                <span>My Space</span>
              </Link>
            </>
          ) : (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/30 font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Portfolio</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
