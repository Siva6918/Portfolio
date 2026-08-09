import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, ArrowLeft, Github, Linkedin, Download } from 'lucide-react';

const Navbar = ({ resumeUrl }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const navLinks = [
    { name: 'About', href: '/#digital-campus' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Timeline', href: '/#career-road' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav w-full">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-sm tracking-tight text-[#fafafa] group-hover:text-[#a5b4fc] transition-colors">
                VENKATA SIVA REDDY
              </span>
              <span className="block text-[10px] font-mono text-[#71717a] tracking-wide">
                Software Engineer
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {!isAdmin ? (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="px-3 py-1.5 text-[13px] font-medium text-[#a1a1aa] hover:text-[#fafafa] transition-colors rounded-lg hover:bg-[#27272a]/50"
                  >
                    {link.name}
                  </a>
                ))}

                <div className="w-px h-5 bg-[#27272a] mx-2" />

                <a
                  href="https://github.com/vasanreddy"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-[#71717a] hover:text-[#fafafa] transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/venkatasiva-reddy/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-[#71717a] hover:text-[#fafafa] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                <Link
                  to="/admin"
                  className="ml-1 p-2 text-[#71717a] hover:text-[#6366f1] transition-colors"
                  aria-label="Admin"
                >
                  <Terminal className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Portfolio</span>
              </Link>
            )}
          </nav>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="https://github.com/vasanreddy"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-[#71717a] hover:text-[#fafafa] transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#a1a1aa] hover:text-[#fafafa]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#27272a] bg-[#0a0a0c]/98 backdrop-blur-xl">
          <div className="section-container py-4 space-y-1">
            {!isAdmin ? (
              <>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]/50 rounded-lg transition-colors"
                  >
                    {link.name}
                  </a>
                ))}

                <div className="h-px bg-[#27272a] my-2" />

                <div className="flex items-center gap-3 px-3 py-2">
                  <a
                    href="https://www.linkedin.com/in/venkatasiva-reddy/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-[#71717a] hover:text-[#fafafa] transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-[#71717a] hover:text-[#6366f1] transition-colors"
                  >
                    <Terminal className="w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#a1a1aa] hover:text-[#fafafa]"
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
