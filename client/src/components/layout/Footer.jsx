import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, Code2 } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 border-t border-[#27272a] bg-[#09090b] pt-16 pb-12 transition-colors w-full">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 flex items-center justify-center text-[#8b5cf6] font-bold text-sm">
                SR
              </div>
              <span className="font-bold text-lg text-[#fafafa]">
                VENKATA SIVA REDDY
              </span>
            </div>
            <p className="text-sm text-[#a1a1aa] max-w-md leading-relaxed">
              Full Stack Developer & Software Engineer. Building production MERN applications, secure backend systems, and AI integrations.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <a
                href="https://github.com/vasanreddy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-[#7dd3fc] hover:scale-110 transition-all cursor-pointer z-30"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/venkata-siva-reddy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-[#7dd3fc] hover:scale-110 transition-all cursor-pointer z-30"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:vasanreddy1331@gmail.com"
                className="w-9 h-9 rounded-xl bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-[#7dd3fc] hover:scale-110 transition-all cursor-pointer z-30"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-[#8b5cf6] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#digital-campus" className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer">Digital Campus</a></li>
              <li><a href="/#career-road" className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer">Career Road</a></li>
              <li><a href="/#skills" className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer">Tech Stack</a></li>
              <li><a href="/#projects" className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer">Featured Projects</a></li>
              <li><a href="/#experience" className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer">Experience</a></li>
              <li><a href="/#contact" className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer">Get in Touch</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#27272a] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#a1a1aa]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Venkata Siva Reddy. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 font-mono text-[11px] text-[#8b5cf6]">
              <Code2 className="w-3.5 h-3.5" /> Built with MERN Stack
            </span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-[#18181b] border border-[#27272a] hover:bg-[#8b5cf6]/20 hover:text-[#8b5cf6] transition-colors cursor-pointer z-30"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4 text-[#fafafa]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
