import React from 'react';
import { Briefcase, GraduationCap, MapPin, Trophy, Code2, ExternalLink } from 'lucide-react';

const ExperienceSection = ({ education = [], experience = [], achievements = [], codingProfiles = [] }) => {
  return (
    <section id="experience" className="py-16 relative w-full">
      <div className="section-container">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center text-[#f97316]">
            <Briefcase className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-mono font-semibold tracking-widest text-[#fdba74]">
              Career & Education
            </h2>
            <h3 className="text-2xl font-bold text-[#fafafa]">
              Experience & Qualifications
            </h3>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Work Experience */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#27272a]">
              <Briefcase className="w-4 h-4 text-[#f97316]" />
              <h4 className="text-base font-bold text-[#fafafa]">Work Experience</h4>
            </div>

            <div className="space-y-3">
              {experience.length > 0 ? (
                experience.map((exp) => (
                  <div key={exp._id || exp.role} className="glass-card p-5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-semibold text-[#f97316]">
                        {exp.startDate} — {exp.endDate || 'Present'}
                      </span>
                      <span className="text-[#52525b] capitalize">{exp.type}</span>
                    </div>

                    <h5 className="text-sm font-bold text-[#fafafa] flex items-center justify-between">
                      <span>
                        {exp.role}{' '}
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#a1a1aa] hover:text-[#f97316] font-normal underline-offset-2 hover:underline inline-flex items-center gap-1 transition-colors"
                          >
                            <span>@ {exp.company}</span>
                            <ExternalLink className="w-3 h-3 text-[#f97316]" />
                          </a>
                        ) : (
                          <span className="text-[#a1a1aa] font-normal">@ {exp.company}</span>
                        )}
                      </span>
                    </h5>

                    <p className="text-xs text-[#a1a1aa] leading-relaxed">
                      {exp.description}
                    </p>

                    {exp.technologies && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.technologies.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-[#18181b] text-[10px] font-mono text-[#71717a] border border-[#27272a]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="glass-card p-5 rounded-xl space-y-2">
                  <span className="text-[11px] font-mono font-semibold text-[#f97316]">Academic & Project Experience</span>
                  <h5 className="text-sm font-bold text-[#fafafa]">Full Stack MERN Developer</h5>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    Built 5+ production-grade MERN applications with authentication, admin systems, state management, and cloud APIs.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#27272a]">
              <GraduationCap className="w-4 h-4 text-[#6366f1]" />
              <h4 className="text-base font-bold text-[#fafafa]">Education</h4>
            </div>

            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu._id || edu.degree} className="glass-card p-5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-[#a5b4fc]">
                      {edu.startYear} — {edu.endYear || 'Present'}
                    </span>
                    {(edu.cgpa || edu.percentage || edu.grade) && (
                      <span className="px-2 py-0.5 rounded-md bg-[#10b981]/10 text-[#10b981] text-[10px] font-mono font-bold border border-[#10b981]/20">
                        {edu.cgpa ? `${edu.cgpa} CGPA` : edu.percentage || edu.grade}
                      </span>
                    )}
                  </div>
                  <h5 className="text-sm font-bold text-[#fafafa]">
                    {edu.degree} {edu.branch && <span className="text-[#a1a1aa]">({edu.branch})</span>}
                  </h5>
                  <p className="text-xs text-[#71717a] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {edu.college}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-[#a1a1aa] leading-relaxed pt-1 border-t border-[#27272a]">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Achievements & Coding Profiles — Compact Sub-sections */}
        {(achievements.length > 0 || codingProfiles.length > 0) && (
          <div className="mt-10 space-y-6">
            
            {/* Achievements */}
            {achievements.length > 0 && (
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-[#27272a] mb-4">
                  <Trophy className="w-4 h-4 text-[#c4b5fd]" />
                  <h4 className="text-base font-bold text-[#fafafa]">Achievements</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {achievements.map((item, idx) => (
                    <div key={item._id || item.title} className="glass-card p-4 rounded-xl space-y-1.5 relative overflow-hidden">
                      <span className="absolute -right-1 -bottom-2 text-5xl font-extrabold font-mono text-[#27272a]/30 select-none">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-mono font-bold text-[#c4b5fd] px-2 py-0.5 rounded-md bg-[#8b5cf6]/10 border border-[#8b5cf6]/15">
                          {item.rank}
                        </span>
                        <span className="text-[10px] font-mono text-[#52525b]">{item.year}</span>
                      </div>
                      <h5 className="text-xs font-bold text-[#fafafa] relative z-10">{item.title}</h5>
                      <p className="text-[10px] text-[#71717a] relative z-10">{item.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coding Profiles */}
            {codingProfiles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-[#27272a] mb-4">
                  <Code2 className="w-4 h-4 text-[#38bdf8]" />
                  <h4 className="text-base font-bold text-[#fafafa]">Coding Profiles</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {codingProfiles.map((p) => (
                    <div key={p._id || p.platform} className="glass-card p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-[#fafafa]">{p.platform}</h5>
                        <a
                          href={p.profileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md text-[#52525b] hover:text-[#38bdf8] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <span className="text-lg font-bold text-[#38bdf8] font-mono">{p.problemsSolved}</span>
                          <span className="block text-[9px] font-mono text-[#52525b]">Solved</span>
                        </div>
                        {p.rating && (
                          <div className="text-center">
                            <span className="text-sm font-bold text-[#c4b5fd] font-mono">{p.rating}</span>
                            <span className="block text-[9px] font-mono text-[#52525b]">Rating</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};

export default ExperienceSection;
