import React from 'react';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 border-t border-[#1a1a1e] bg-[#09090b] py-8 w-full">
      <div className="section-container">
        
        {/* Top Row: Brand + Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-[10px] font-bold">
              SR
            </div>
            <span className="font-semibold text-sm text-[#fafafa]">
              Venkata Siva Reddy
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/vasanreddy"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a]/50 transition-all"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/venkatasiva-reddy/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a]/50 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:vasanreddy1331@gmail.com"
              className="p-2 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a]/50 transition-all"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            
            <div className="w-px h-5 bg-[#27272a] mx-1" />
            
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a]/50 transition-all"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Copyright */}
        <div className="pt-4 border-t border-[#1a1a1e] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#52525b]">
          <span>© {new Date().getFullYear()} Venkata Siva Reddy. All rights reserved.</span>
          <span className="font-mono text-[11px]">Built with MERN Stack</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
