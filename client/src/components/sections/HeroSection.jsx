import React from 'react';
import { Download, ArrowRight, Github, Linkedin, Mail, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { resolveMediaUrl } from '../../services/api';
import { openPdfInNewTab, downloadPdf } from '../../utils/pdfHelpers';
import HeroWorkspace from './HeroWorkspace';

const easeCurve = [0.16, 1, 0.3, 1];

const HeroSection = ({ profile, resumeUrl }) => {
  const activeResumeTarget = resolveMediaUrl(resumeUrl || profile?.resumeUrl) || '/Venkata_Siva_Reddy_Resume.pdf';

  return (
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 w-full overflow-hidden">
      <div className="section-container">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Editorial Left Column */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Status Pill (0ms delay) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.0, ease: easeCurve }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-600 dark:text-emerald-400"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for Software Engineering Internships</span>
            </motion.div>

            {/* 2. Main Heading (100ms delay) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="space-y-3"
            >
              <p className="text-xs font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-semibold">
                HI, I'M SIVA
              </p>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                I build software <br className="hidden sm:inline" />
                that turns ideas into <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-300 dark:via-purple-300 dark:to-amber-200">
                  useful products.
                </span>
              </h1>
            </motion.div>

            {/* 3. Persona Tagline / Role (200ms delay) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: easeCurve }}
              className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-700 dark:text-white/70 pt-1"
            >
              <span className="px-3 py-1 rounded-md bg-white dark:bg-[#121217] border border-slate-200 dark:border-zinc-800 shadow-sm">Full Stack Developer</span>
              <span className="text-slate-400 dark:text-white/40">·</span>
              <span className="px-3 py-1 rounded-md bg-white dark:bg-[#121217] border border-slate-200 dark:border-zinc-800 shadow-sm">MERN Stack</span>
              <span className="text-slate-400 dark:text-white/40">·</span>
              <span className="px-3 py-1 rounded-md bg-white dark:bg-[#121217] border border-slate-200 dark:border-zinc-800 shadow-sm">AI / ML</span>
            </motion.div>

            {/* 4. Authentic Bio Description (300ms delay) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: easeCurve }}
              className="text-sm sm:text-base text-slate-700 dark:text-white/70 leading-relaxed max-w-xl"
            >
              I'm a Computer Science student at Rajeev Gandhi Memorial College of Engineering (graduating 2027). 
              I enjoy architecting full-stack applications and experimenting with AI models when they make a product genuinely better.
            </motion.p>

            {/* 5. Action Buttons (400ms delay) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: easeCurve }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200"
              >
                <span>EXPLORE CASE STUDIES</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </a>

              <button
                type="button"
                onClick={() => openPdfInNewTab(activeResumeTarget)}
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#121217] hover:bg-slate-100 dark:hover:bg-[#1a1a22] border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-white font-mono text-xs font-semibold active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
                <span>RESUME</span>
              </button>

              <button
                type="button"
                onClick={() => downloadPdf(activeResumeTarget, 'Venkata_Siva_Reddy_Resume.pdf')}
                className="group p-3 rounded-xl bg-white dark:bg-[#121217] hover:bg-slate-100 dark:hover:bg-[#1a1a22] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white active:scale-[0.98] transition-all duration-200 shadow-sm"
                aria-label="Download Resume"
                title="Download Resume PDF"
              >
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
              </button>
            </motion.div>

            {/* 6. Social Links (500ms delay) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: easeCurve }}
              className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-zinc-800/80 max-w-md"
            >
              <a
                href={profile?.github || "https://github.com/vasanreddy"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <span className="text-slate-300 dark:text-zinc-800">|</span>
              <a
                href={profile?.linkedin || "https://www.linkedin.com/in/venkatasiva-reddy/"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <span className="text-slate-300 dark:text-zinc-800">|</span>
              <a
                href={`mailto:${profile?.email || 'vasanreddy1331@gmail.com'}`}
                className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
            </motion.div>

          </div>

          {/* 7. Interactive Workspace Right Column (200ms delay) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: easeCurve }}
            className="lg:col-span-6"
          >
            <HeroWorkspace profile={profile} />
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
