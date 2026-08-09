import React from 'react';
import { User, Target, Cpu, GraduationCap, MapPin, ExternalLink } from 'lucide-react';

const DigitalCampusSection = ({ profile, education = [] }) => {
  const longBio = profile?.longBio || 'Computer Science student capable of building scalable full-stack applications, designing robust backend architectures, and integrating AI/ML solutions into modern web platforms.';
  const careerGoal = profile?.careerGoal || 'Become a strong software engineer capable of building scalable applications and integrating AI-driven solutions into modern web platforms.';
  const currentFocus = profile?.currentFocus || 'MERN Stack, Data Structures & Algorithms, Cloud Infrastructure, AI Integration';
  const collegeName = profile?.educationSummary?.college || profile?.college || 'Rajeev Gandhi Memorial College of Engineering and Technology';
  const collegeUrl = profile?.collegeUrl || 'https://www.rgmcet.edu.in/';
  const cgpa = profile?.educationSummary?.cgpa || profile?.cgpa || '8.1';

  return (
    <section id="digital-campus" className="py-16 relative w-full">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1]">
            <User className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-mono font-semibold tracking-widest text-[#a5b4fc]">
              Background
            </h2>
            <h3 className="text-2xl font-bold text-[#fafafa]">
              About & Education
            </h3>
          </div>
        </div>

        {/* Two Column: Bio + Education */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Bio */}
          <div className="lg:col-span-7 space-y-5">
            <div className="glass-card p-6 sm:p-7 rounded-xl space-y-5">
              <p className="text-[15px] text-[#d4d4d8] leading-relaxed">
                {longBio}
              </p>

              <div className="space-y-4 pt-3 border-t border-[#27272a]">
                <div className="flex items-start gap-3">
                  <Target className="w-4 h-4 text-[#a5b4fc] mt-1 shrink-0" />
                  <div>
                    <span className="block text-[11px] font-mono font-semibold uppercase text-[#71717a] tracking-wider">Career Goal</span>
                    <p className="text-sm text-[#e4e4e7] mt-0.5">{careerGoal}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Cpu className="w-4 h-4 text-[#a5b4fc] mt-1 shrink-0" />
                  <div>
                    <span className="block text-[11px] font-mono font-semibold uppercase text-[#71717a] tracking-wider">Current Focus</span>
                    <p className="text-sm text-[#e4e4e7] mt-0.5">{currentFocus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Education + Metrics */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Metrics Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card p-4 rounded-xl text-center">
                <span className="block text-2xl font-bold text-[#6366f1] font-mono">{cgpa}</span>
                <span className="block text-[10px] font-mono text-[#71717a] mt-0.5">CGPA</span>
              </div>
              <div className="glass-card p-4 rounded-xl text-center">
                <span className="block text-2xl font-bold text-[#a5b4fc] font-mono">2027</span>
                <span className="block text-[10px] font-mono text-[#71717a] mt-0.5">Graduation</span>
              </div>
              <div className="glass-card p-4 rounded-xl text-center">
                <span className="block text-2xl font-bold text-[#10b981] font-mono">B.Tech</span>
                <span className="block text-[10px] font-mono text-[#71717a] mt-0.5">CSE</span>
              </div>
            </div>

            {/* Education Cards */}
            <div className="space-y-3">
              {education.length > 0 ? education.map((edu) => {
                const targetUrl = edu.collegeUrl || (edu.college?.includes('Rajeev Gandhi') || edu.college?.includes('RGMCET') ? collegeUrl : null);
                return (
                  <div key={edu._id || edu.degree} className="glass-card p-5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#a5b4fc]" />
                        <span className="text-xs font-mono font-semibold text-[#a5b4fc]">
                          {edu.startYear} — {edu.endYear || 'Present'}
                        </span>
                      </div>
                      {(edu.cgpa || edu.percentage || edu.grade) && (
                        <span className="px-2 py-0.5 rounded-md bg-[#10b981]/10 text-[#10b981] text-[10px] font-mono font-bold border border-[#10b981]/20">
                          {edu.cgpa ? `${edu.cgpa} CGPA` : edu.percentage || edu.grade}
                        </span>
                      )}
                    </div>
                    <h5 className="text-sm font-bold text-[#fafafa]">
                      {edu.degree} {edu.branch && <span className="text-[#a1a1aa]">({edu.branch})</span>}
                    </h5>
                    <div className="text-xs text-[#71717a] flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {targetUrl ? (
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#a1a1aa] hover:text-[#a5b4fc] transition-colors underline-offset-2 hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            <span>{edu.college}</span>
                            <ExternalLink className="w-3 h-3 text-[#a5b4fc]" />
                          </a>
                        ) : (
                          <span>{edu.college}</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              }) : (
                <div className="glass-card p-5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#a5b4fc]" />
                    <span className="text-xs font-mono font-semibold text-[#a5b4fc]">2023 — 2027</span>
                  </div>
                  <h5 className="text-sm font-bold text-[#fafafa]">B.Tech Computer Science & Engineering</h5>
                  <div className="text-xs text-[#71717a] flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <a
                        href={collegeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#a1a1aa] hover:text-[#a5b4fc] transition-colors underline-offset-2 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        <span>{collegeName}</span>
                        <ExternalLink className="w-3 h-3 text-[#a5b4fc]" />
                      </a>
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default DigitalCampusSection;
