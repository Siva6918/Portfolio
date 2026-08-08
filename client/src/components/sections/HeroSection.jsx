import React from 'react';
import { Download, ArrowRight, Github, Linkedin, Mail, Code2 } from 'lucide-react';

const HeroSection = ({ profile, resumeUrl }) => {
  const name = profile?.name || 'VENKATA SIVA REDDY';
  const role = profile?.role || 'FULL STACK & SOFTWARE ENGINEER';
  const shortBio = profile?.shortBio || 'B.Tech CSE Student (2023-2027) building production MERN applications, cloud backend architectures, and AI integrations.';
  const avatarImage = profile?.profileImage || '/Avatar.png';
  const cgpa = profile?.educationSummary?.cgpa || '8.1';

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
              <a href={profile?.linkedin || "https://linkedin.com/in/venkata-siva-reddy"} target="_blank" rel="noreferrer" className="text-[#a1a1aa] hover:text-[#06b6d4] transition-colors p-2.5 rounded-xl bg-[#121217] border border-[#2d2d3a] hover:border-[#6366f1]">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={`mailto:${profile?.email || 'vasanreddy1331@gmail.com'}`} className="text-[#a1a1aa] hover:text-[#06b6d4] transition-colors p-2.5 rounded-xl bg-[#121217] border border-[#2d2d3a] hover:border-[#6366f1]">
                <Mail className="w-5 h-5" />
              </a>
            </div>

          </div>

          {/* Avatar Column (Right Side - Single Primary Academic Marker) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative group">
              
              {/* Outer Electric Indigo & Neon Violet Accent Glow Ring */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#6366f1]/35 via-[#c084fc]/35 to-[#6366f1]/35 blur-xl group-hover:opacity-100 transition duration-500"></div>
              
              {/* Profile Image Container */}
              <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-3xl overflow-hidden bg-[#121217] p-2 border border-[#2d2d3a] shadow-2xl">
                <img
                  src={avatarImage}
                  alt={name}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Single Environmental Marker near Avatar: Academic CGPA */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#121217]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#6366f1]/40 shadow-2xl flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]"></span>
                <span className="text-xs font-bold font-mono text-[#fafafa]">{cgpa} CGPA (B.Tech CSE)</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
