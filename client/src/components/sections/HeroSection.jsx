import React, { useState, useEffect } from 'react';
import { Download, ArrowRight, Github, Linkedin, Mail, User, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveMediaUrl } from '../../services/api';
import ImageWithFallback from '../common/ImageWithFallback';
import { openPdfInNewTab, downloadPdf } from '../../utils/pdfHelpers';

const HeroSection = ({ profile, resumeUrl }) => {
  const name = profile?.name || 'VENKATA SIVA REDDY';
  const primaryRole = profile?.role || 'Full Stack Developer & Software Engineer';
  const shortBio = profile?.shortBio || 'B.Tech CSE Student (2023-2027) building production MERN applications, cloud backend architectures, and AI integrations.';

  const roles = [
    primaryRole,
    'Full Stack Developer',
    'Software Engineer',
    'MERN Stack Developer',
    'AI Integration Developer'
  ];

  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [roles.length]);

  const activeResumeTarget = resolveMediaUrl(resumeUrl || profile?.resumeUrl) || '/Venkata_Siva_Reddy_Resume.pdf';
  const bioWords = shortBio.split(' ');

  return (
    <section className="relative min-h-[80vh] flex items-center pt-12 pb-16 w-full">
      <div className="section-container z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-xs font-medium text-[#10b981]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span>Open to Opportunities</span>
            </motion.div>

            {/* 2. Name & Rotating Role */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#fafafa] leading-[1.1]"
              >
                {name}
              </motion.h1>

              {/* Rotating Title Container with fixed height to prevent layout shift */}
              <div className="min-h-[36px] sm:min-h-[42px] flex items-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={roles[roleIndex]}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg sm:text-xl font-semibold text-[#a5b4fc]"
                  >
                    {roles[roleIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* 3. Bio Word-by-Word Reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-base text-[#a1a1aa] leading-relaxed max-w-xl flex flex-wrap gap-x-1.5"
            >
              {bioWords.map((word, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + idx * 0.025, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>

            {/* 4. CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#7c3aed] hover:shadow-[0_4px_20px_rgba(99,102,241,0.35)] active:scale-[0.97] transition-all duration-200"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </a>

              {/* View Resume Button */}
              <button
                type="button"
                onClick={() => openPdfInNewTab(activeResumeTarget)}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#18181b] text-[#fafafa] text-sm font-semibold border border-[#27272a] hover:border-[#6366f1] hover:text-[#a5b4fc] hover:shadow-[0_4px_16px_rgba(99,102,241,0.2)] active:scale-[0.97] transition-all duration-200"
                aria-label="View Resume PDF in new tab"
              >
                <Eye className="w-4 h-4 text-[#a5b4fc] group-hover:scale-110 transition-transform duration-200" />
                <span>View Resume</span>
              </button>

              {/* Download Resume Button */}
              <button
                type="button"
                onClick={() => downloadPdf(activeResumeTarget, 'Venkata_Siva_Reddy_Resume.pdf')}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#18181b] text-[#fafafa] text-sm font-semibold border border-[#27272a] hover:border-[#3f3f46] hover:text-[#fafafa] active:scale-[0.97] transition-all duration-200"
                aria-label="Download Resume PDF"
              >
                <Download className="w-4 h-4 text-[#a5b4fc] group-hover:translate-y-0.5 transition-transform duration-200" />
                <span>Download</span>
              </button>
            </motion.div>

            {/* 5. Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
              className="flex items-center gap-2 pt-2"
            >
              <a 
                href={profile?.github || "https://github.com/vasanreddy"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a]/60 hover:-translate-y-1 hover:scale-105 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href={profile?.linkedin || "https://www.linkedin.com/in/venkatasiva-reddy/"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a]/60 hover:-translate-y-1 hover:scale-105 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={`mailto:${profile?.email || 'vasanreddy1331@gmail.com'}`} 
                className="p-2.5 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a]/60 hover:-translate-y-1 hover:scale-105 transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </motion.div>

          </div>

          {/* Avatar Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1 }}
            className="lg:col-span-5 flex justify-center pt-4 lg:pt-0"
          >
            <div className="relative">
              {/* Subtle glow behind avatar */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/15 blur-2xl animate-glow" />
              
              {/* Avatar */}
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-2 border-[#27272a] bg-[#18181b] shadow-xl hover:border-[#6366f1]/50 transition-all duration-300">
                <ImageWithFallback
                  src={profile?.profileImage}
                  fallbackSrc="/Avatar.png"
                  alt={name}
                  updatedAt={profile?.updatedAt}
                  fallbackIcon={User}
                  loading="eager"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;

