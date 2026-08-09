import React from 'react';
import { Download, ArrowRight, Github, Linkedin, Mail, User, Eye } from 'lucide-react';
import { resolveMediaUrl } from '../../services/api';
import ImageWithFallback from '../common/ImageWithFallback';
import { openPdfInNewTab, downloadPdf } from '../../utils/pdfHelpers';

const HeroSection = ({ profile, resumeUrl }) => {
  const name = profile?.name || 'VENKATA SIVA REDDY';
  const role = profile?.role || 'Full Stack & Software Engineer';
  const shortBio = profile?.shortBio || 'B.Tech CSE Student (2023-2027) building production MERN applications, cloud backend architectures, and AI integrations.';

  const activeResumeTarget = resolveMediaUrl(resumeUrl || profile?.resumeUrl) || '/Venkata_Siva_Reddy_Resume.pdf';

  return (
    <section className="relative min-h-[80vh] flex items-center pt-12 pb-16 w-full">
      <div className="section-container z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-xs font-medium text-[#10b981]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span>Open to Opportunities</span>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#fafafa] leading-[1.1]">
                {name}
              </h1>
              <p className="text-lg sm:text-xl font-semibold text-[#a5b4fc]">
                {role}
              </p>
            </div>

            {/* Bio */}
            <p className="text-base text-[#a1a1aa] leading-relaxed max-w-xl">
              {shortBio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#7c3aed] transition-colors"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* View Resume Button */}
              <button
                type="button"
                onClick={() => openPdfInNewTab(activeResumeTarget)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#18181b] text-[#fafafa] text-sm font-semibold border border-[#27272a] hover:border-[#6366f1] hover:text-[#a5b4fc] transition-all"
                aria-label="View Resume PDF in new tab"
              >
                <Eye className="w-4 h-4 text-[#a5b4fc]" />
                <span>View Resume</span>
              </button>

              {/* Download Resume Button */}
              <button
                type="button"
                onClick={() => downloadPdf(activeResumeTarget, 'Venkata_Siva_Reddy_Resume.pdf')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#18181b] text-[#fafafa] text-sm font-semibold border border-[#27272a] hover:border-[#3f3f46] hover:text-[#fafafa] transition-all"
                aria-label="Download Resume PDF"
              >
                <Download className="w-4 h-4 text-[#a5b4fc]" />
                <span>Download</span>
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              <a 
                href={profile?.github || "https://github.com/vasanreddy"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a]/50 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href={profile?.linkedin || "https://www.linkedin.com/in/venkatasiva-reddy/"} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a]/50 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={`mailto:${profile?.email || 'vasanreddy1331@gmail.com'}`} 
                className="p-2.5 rounded-lg text-[#71717a] hover:text-[#fafafa] hover:bg-[#27272a]/50 transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

          </div>

          {/* Avatar Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              {/* Subtle glow behind avatar */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[#6366f1]/15 to-[#8b5cf6]/10 blur-2xl" />
              
              {/* Avatar */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-[#27272a] bg-[#18181b]">
                <ImageWithFallback
                  src={profile?.profileImage}
                  fallbackSrc="/Avatar.png"
                  alt={name}
                  updatedAt={profile?.updatedAt}
                  fallbackIcon={User}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
