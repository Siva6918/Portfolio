import React from 'react';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-100/80 dark:bg-[#09090c] py-10 w-full">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="section-container"
      >
        
        {/* Main Footer Layout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-zinc-800/60">
          
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              VENKATA SIVA REDDY
            </h3>
            <p className="text-xs font-mono text-slate-600 dark:text-white/50">
              Full Stack Developer & Software Engineer · B.Tech CSE '27
            </p>
          </div>

          {/* Social Links & Scroll Top */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/vasanreddy"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/venkatasiva-reddy/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:vasanreddy1331@gmail.com"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>

            <div className="w-px h-5 bg-slate-200 dark:bg-zinc-800 mx-1" />

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-xs font-mono text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 active:scale-95 transition-all duration-200 shadow-sm"
              aria-label="Back to top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500 dark:text-white/50">
          <span>© {new Date().getFullYear()} Venkata Siva Reddy. Crafted with React & Node.js</span>
          <span>Andhra Pradesh, India</span>
        </div>

      </motion.div>
    </footer>
  );
};

export default Footer;
