import React from 'react';
import { Download, ArrowRight, Github, Linkedin, Mail, Code2 } from 'lucide-react';
import { resolveMediaUrl } from '../../services/api';

const HeroSection = ({ profile, resumeUrl }) => {
  const name = profile?.name || 'VENKATA SIVA REDDY';
  const role = profile?.role || 'FULL STACK & SOFTWARE ENGINEER';
  const shortBio = profile?.shortBio || 'B.Tech CSE Student (2023-2027) building production MERN applications, cloud backend architectures, and AI integrations.';
  const avatarImage = resolveMediaUrl(profile?.profileImage) || '/Avatar.png';
  const cgpa = profile?.cgpa || profile?.educationSummary?.cgpa || '8.1';

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-10 pb-16 overflow-hidden w-full bg-transparent">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 z-10">
        
        {/* Asymmetric Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content Column (Left) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Status Pill (Emerald Green Pulse for Availability) */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#121217] border border-[#2d2d3a] text-xs font-mono font-medium shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
              </span>
              <span className="font-bold text-[#fafafa]">Available for Software Engineering Internships & Roles</span>
            </div>

            {/* Name & Role Header */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#fafafa] leading-[1.1]">
                Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fafafa] via-[#c084fc] to-[#6366f1]">{name}</span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-[#6366f1] font-mono tracking-tight flex items-center gap-2">
                <Code2 className="w-6 h-6 text-[#6366f1] shrink-0" />
                <span>{role}</span>
              </p>
            </div>

            {/* Short Bio */}
            <p className="text-base sm:text-lg text-[#a1a1aa] leading-relaxed max-w-2xl font-medium">
              {shortBio}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#6366f1] text-[#fafafa] font-bold text-sm hover:bg-[#c084fc] transition-all hover:scale-105 shadow-[0_0_25px_rgba(99,102,241,0.4)]"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 text-[#fafafa]" />
              </a>

              <a
                href={resumeUrl || '/Venkata_Siva_Reddy_Resume.pdf'}
                download="Venkata_Siva_Reddy_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#121217] hover:bg-[#1a1a22] text-[#fafafa] font-bold text-sm border border-[#2d2d3a] transition-all hover:scale-105"
              >
                <Download className="w-4 h-4 text-[#6366f1]" />
                <span>Download Resume</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-5 pt-3">
              <span className="text-xs uppercase font-mono text-[#a1a1aa] tracking-wider font-bold">Connect:</span>
              <a href={profile?.github || "https://github.com/vasanreddy"} target="_blank" rel="noreferrer" className="text-[#a1a1aa] hover:text-[#06b6d4] transition-colors p-2.5 rounded-xl bg-[#121217] border border-[#2d2d3a] hover:border-[#6366f1]">
                <Github className="w-5 h-5" />
              </a>
              <a href={profile?.linkedin || "https://www.linkedin.com/in/venkatasiva-reddy/"} target="_blank" rel="noreferrer" className="text-[#a1a1aa] hover:text-[#06b6d4] transition-colors p-2.5 rounded-xl bg-[#121217] border border-[#2d2d3a] hover:border-[#6366f1]">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={`mailto:${profile?.email || 'vasanreddy1331@gmail.com'}`} className="text-[#a1a1aa] hover:text-[#06b6d4] transition-colors p-2.5 rounded-xl bg-[#121217] border border-[#2d2d3a] hover:border-[#6366f1]">
                <Mail className="w-5 h-5" />
              </a>
            </div>

          </div>

          {/* Avatar Column (Right Side — Circular with Role Tags) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative group">
              
              {/* Outer Electric Glow Ring (circle) */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#6366f1]/40 via-[#c084fc]/30 to-[#06b6d4]/40 blur-2xl opacity-70 group-hover:opacity-100 transition duration-700"></div>
              
              {/* Rotating Border Ring */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#6366f1] via-[#c084fc] to-[#06b6d4] opacity-30 group-hover:opacity-60 transition duration-500" style={{ animation: 'spin 8s linear infinite' }}></div>
              
              {/* Circular Profile Image Container */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden bg-[#121217] p-1.5 border-2 border-[#2d2d3a] shadow-2xl">
                <img
                  src={avatarImage}
                  alt={name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Top-Right Tag — Role Badge */}
              <div className="absolute -top-2 -right-2 sm:top-2 sm:-right-4 bg-[#121217]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#6366f1]/50 shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 max-w-[180px] sm:max-w-[240px] z-20">
                <Code2 className="w-3.5 h-3.5 text-[#6366f1] shrink-0" />
                <span className="text-[10px] font-bold font-mono text-[#fafafa] uppercase tracking-wide truncate">
                  {role}
                </span>
              </div>

              {/* Bottom Center — CGPA Marker */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#121217]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#6366f1]/40 shadow-2xl flex items-center gap-2.5 whitespace-nowrap z-20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1] shrink-0"></span>
                <span className="text-xs font-bold font-mono text-[#fafafa]">{cgpa} CGPA (B.Tech CSE)</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* CSS for spinning border */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
