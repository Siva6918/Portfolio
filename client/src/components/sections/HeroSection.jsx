import React from 'react';
import { Download, ArrowRight, Github, Linkedin, Mail, Eye, Briefcase, Flame, Crosshair, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { resolveMediaUrl } from '../../services/api';
import { openPdfInNewTab, downloadPdf } from '../../utils/pdfHelpers';
import { useAnalytics } from '../../context/AnalyticsContext';
import HeroWorkspace from './HeroWorkspace';
import RoleAnimator from './RoleAnimator';
import SwipeableCarousel from '../common/SwipeableCarousel';
import { useProfileModal } from '../../context/ProfileModalContext';

const easeCurve = [0.16, 1, 0.3, 1];

const HeroSection = ({ profile, resumeUrl }) => {
  const activeResumeTarget = resolveMediaUrl(resumeUrl || profile?.resumeUrl) || '/Siva_Resume_SDE_1 (1).pdf';
  const { trackInteraction } = useAnalytics();
  const { openProfile } = useProfileModal();

  const handleViewResume = () => {
    trackInteraction('view_resume', 'Resume PDF', 'Hero');
    openPdfInNewTab(activeResumeTarget);
  };

  const handleDownloadResume = () => {
    trackInteraction('download_resume', 'Resume PDF', 'Hero');
    downloadPdf(activeResumeTarget, 'Siva_Resume_SDE_1.pdf');
  };

  return (
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 w-full overflow-hidden">
      <div className="section-container">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Tactical Left Column */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Tactical Status Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.0, ease: easeCurve }}
              className="flex flex-wrap items-center gap-2.5"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-marigold/10 border border-marigold/35 text-xs font-mono text-marigold font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-marigold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-marigold"></span>
                </span>
                <span>Available for SWE Internships</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neonRose/10 border border-neonRose/35 text-xs font-mono text-neonRose font-bold tracking-wide">
                <Flame className="w-3.5 h-3.5 fill-neonRose" />
                <span>FREE FIRE CLUTCH GAMER & DEV</span>
              </div>
            </motion.div>

            {/* 2. Main Heading (100ms delay) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openProfile(resolveMediaUrl(profile?.profileImage) || '/Avatar.png')}
                  className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer bg-[#08080a]/90 border-marigold/50 hover:border-marigold shadow-[0_0_16px_rgba(245,158,11,0.25)]"
                  title="Click to view full profile photo"
                >
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-marigold/70 shrink-0">
                    <img
                      src={resolveMediaUrl(profile?.profileImage) || '/Avatar.png'}
                      alt="Siva"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.target.src = '/Avatar.png'; }}
                    />
                  </div>
                  <span className="font-mono text-xs tracking-widest text-marigold uppercase font-bold">
                    HI, I'M SIVA
                  </span>
                  <span className="text-[10px] font-mono text-iceSilver-dark group-hover:text-iceSilver transition-colors">
                    (VIEW PHOTO)
                  </span>
                </button>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-iceSilver leading-[1.08]">
                I build software <br className="hidden sm:inline" />
                that turns ideas into <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-marigold via-neonRose to-iceSilver">
                  useful products.
                </span>
              </h1>
            </motion.div>

            {/* 3. Persona Tagline / Role - Animated role typewriter */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: easeCurve }}
              className="py-1"
            >
              <RoleAnimator />
            </motion.div>

            {/* 4. Authentic Gamer & Dev Bio Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: easeCurve }}
              className="text-sm sm:text-base text-iceSilver-dark leading-relaxed max-w-xl font-mono"
            >
              Computer Science student at RGMCET (graduating 2027) & competitive Free Fire clutch tactician. Bringing high-APM tactical reflexes, quick decision-making under pressure, and clean full-stack MERN & AI engineering to real-world software products.
            </motion.p>

            {/* Mobile View Carousel (sm:hidden) */}
            <div className="block sm:hidden pt-2">
              <SwipeableCarousel showDots={true}>
                {/* Mobile Slide 1: Status & Focus */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Available for Internships</span>
                  </div>
                  <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                    Full Stack & AI Engineer
                  </h3>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-zinc-500">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">MERN Stack</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">FastAPI</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">Cloud AI</span>
                  </div>
                </div>

                {/* Mobile Slide 2: Bio & Degree */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono text-green-500 uppercase font-semibold">
                    Academic Background
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    B.Tech CSE student at Rajeev Gandhi Memorial College of Engineering (graduating 2027), specializing in full-stack architecture and AI integrations.
                  </p>
                </div>

                {/* Mobile Slide 3: Quick Social Links */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">Connect & Links</span>
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-700 dark:text-zinc-300">
                    <a
                      href={profile?.github || "https://github.com/vasanreddy"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackInteraction('github_click', profile?.github || 'GitHub', 'Hero')}
                      className="flex items-center gap-1.5 hover:text-indigo-500"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={profile?.linkedin || "https://www.linkedin.com/in/venkatasiva-reddy/"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackInteraction('linkedin_click', profile?.linkedin || 'LinkedIn', 'Hero')}
                      className="flex items-center gap-1.5 hover:text-indigo-500"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </SwipeableCarousel>
            </div>

            {/* Action & Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: easeCurve }}
              className="flex flex-wrap items-center gap-2.5 pt-2"
            >
              {/* 1. Primary Action: Explore Case Studies */}
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-black font-mono text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #f43f5e)",
                  boxShadow: "0 8px 26px -4px rgba(245, 158, 11, 0.45)",
                }}
              >
                <span>EXPLORE LOADOUT (WORK)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </a>
              
              {/* 2. Contact Me */}
              <a
                href="#contact-me-form"
                onClick={(e) => { e.preventDefault(); document.getElementById('contact-me-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="group inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl border font-mono text-xs font-semibold text-iceSilver transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "rgba(8,8,10,0.92)",
                  borderColor: "rgba(244,63,94,0.45)",
                  boxShadow: "0 4px 18px -2px rgba(244,63,94,0.18)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#f43f5e";
                  e.currentTarget.style.boxShadow = "0 8px 28px -4px rgba(244,63,94,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(244,63,94,0.45)";
                  e.currentTarget.style.boxShadow = "0 4px 18px -2px rgba(244,63,94,0.18)";
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center border transition-transform group-hover:scale-110"
                  style={{ background: "rgba(244,63,94,0.18)", borderColor: "rgba(244,63,94,0.4)" }}
                >
                  <Mail className="w-3.5 h-3.5 text-neonRose" />
                </div>
                <span>CONTACT ME</span>
              </a>

              {/* 3. Freelance Opportunity */}
              <a
                href="#freelance-form"
                onClick={(e) => { e.preventDefault(); document.getElementById('freelance-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="group inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl border font-mono text-xs font-semibold text-iceSilver transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "rgba(8,8,10,0.92)",
                  borderColor: "rgba(245,158,11,0.45)",
                  boxShadow: "0 4px 18px -2px rgba(245,158,11,0.18)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#f59e0b";
                  e.currentTarget.style.boxShadow = "0 8px 28px -4px rgba(245,158,11,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.45)";
                  e.currentTarget.style.boxShadow = "0 4px 18px -2px rgba(245,158,11,0.18)";
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center border transition-transform group-hover:scale-110"
                  style={{ background: "rgba(245,158,11,0.18)", borderColor: "rgba(245,158,11,0.4)" }}
                >
                  <Briefcase className="w-3.5 h-3.5 text-marigold" />
                </div>
                <span>FREELANCE CONTRACT</span>
              </a>

              {/* 4. View Resume */}
              <button
                type="button"
                onClick={handleViewResume}
                className="group inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl border font-mono text-xs font-semibold text-iceSilver transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "rgba(8,8,10,0.92)",
                  borderColor: "rgba(226,232,240,0.35)",
                  boxShadow: "0 4px 18px -2px rgba(226,232,240,0.12)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "0 8px 28px -4px rgba(226,232,240,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(226,232,240,0.35)";
                  e.currentTarget.style.boxShadow = "0 4px 18px -2px rgba(226,232,240,0.12)";
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center border transition-transform group-hover:scale-110"
                  style={{ background: "rgba(226,232,240,0.15)", borderColor: "rgba(226,232,240,0.35)" }}
                >
                  <Eye className="w-3.5 h-3.5 text-iceSilver" />
                </div>
                <span>RESUME</span>
              </button>

              {/* 5. Download Resume PDF */}
              <button
                type="button"
                onClick={handleDownloadResume}
                className="group p-3.5 rounded-xl border transition-all duration-300 hover:scale-[1.05] active:scale-[0.98]"
                style={{
                  background: "rgba(8,8,10,0.92)",
                  borderColor: "rgba(245,158,11,0.35)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.25)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#f59e0b";
                  e.currentTarget.style.boxShadow = "0 6px 22px -2px rgba(245,158,11,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.35)";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.25)";
                }}
                aria-label="Download Resume"
                title="Download Resume PDF"
              >
                <Download className="w-4 h-4 text-iceSilver group-hover:text-marigold group-hover:translate-y-0.5 transition-all duration-200" />
              </button>
            </motion.div>

            {/* Desktop Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: easeCurve }}
              className="hidden sm:flex items-center gap-3 pt-2 border-t border-zinc-800 max-w-md"
            >
              <a
                href={profile?.github || "https://github.com/vasanreddy"}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackInteraction('github_click', profile?.github || 'GitHub', 'Hero')}
                className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <span className="text-zinc-800">|</span>
              <a
                href={profile?.linkedin || "https://www.linkedin.com/in/venkatasiva-reddy/"}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackInteraction('linkedin_click', profile?.linkedin || 'LinkedIn', 'Hero')}
                className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <span className="text-zinc-800">|</span>
              <a
                href={`mailto:${profile?.email || 'vasanreddy1331@gmail.com'}`}
                onClick={() => trackInteraction('email_click', profile?.email || 'Email', 'Hero')}
                className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors duration-200"
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

