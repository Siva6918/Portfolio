import React from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, ExternalLink } from 'lucide-react';

const ExperienceSection = ({ education = [], experience = [] }) => {
  return (
    <section id="experience" className="py-20 relative w-full bg-transparent">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-[#8b5cf6]/10 border border-purple-500/30 dark:border-[#8b5cf6]/30 flex items-center justify-center text-purple-700 dark:text-[#8b5cf6]">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-purple-700 dark:text-[#8b5cf6]">
              Career & Education
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#fafafa]">
              Timeline & Qualifications
            </h3>
          </div>
        </div>

        {/* Dual Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Education Timeline */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-[#27272a] pb-4">
              <GraduationCap className="w-5 h-5 text-sky-600 dark:text-[#38bdf8]" />
              <h4 className="text-xl font-bold text-slate-900 dark:text-[#fafafa]">Education Journey</h4>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-300 dark:border-[#8b5cf6]/30 space-y-8">
              {education.map((edu) => (
                <div key={edu._id || edu.degree} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-100 dark:bg-[#09090b] border-2 border-sky-500 dark:border-[#38bdf8] group-hover:scale-125 transition-transform"></div>

                  <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-[#27272a] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-sky-700 dark:text-[#38bdf8]">
                        {edu.startYear} — {edu.endYear || 'Present'}
                      </span>
                      {edu.grade && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-[#34d399]/10 text-emerald-700 dark:text-[#34d399] border border-emerald-500/20 text-[10px] font-mono font-bold">
                          {edu.grade}
                        </span>
                      )}
                    </div>

                    <h5 className="text-lg font-bold text-slate-900 dark:text-[#fafafa]">
                      {edu.degree} {edu.branch && <span className="text-slate-700 dark:text-[#a1a1aa]">({edu.branch})</span>}
                    </h5>

                    <p className="text-xs font-bold text-slate-800 dark:text-[#a1a1aa] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{edu.college}</span>
                    </p>

                    {edu.description && (
                      <p className="text-xs text-slate-800 dark:text-[#a1a1aa] leading-relaxed pt-2 border-t border-slate-200 dark:border-[#27272a] font-medium">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work / Practical Experience Timeline */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-[#27272a] pb-4">
              <Briefcase className="w-5 h-5 text-orange-600 dark:text-[#f97316]" />
              <h4 className="text-xl font-bold text-slate-900 dark:text-[#fafafa]">Experience & Roles</h4>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-300 dark:border-[#8b5cf6]/30 space-y-8">
              {experience.length > 0 ? (
                experience.map((exp) => (
                  <div key={exp._id || exp.role} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-100 dark:bg-[#09090b] border-2 border-orange-500 dark:border-[#f97316] group-hover:scale-125 transition-transform"></div>

                    <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-[#27272a] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-orange-700 dark:text-[#f97316]">
                        <span>{exp.startDate} — {exp.endDate || 'Present'}</span>
                        <span className="capitalize">{exp.type}</span>
                      </div>

                      <h5 className="text-lg font-bold text-slate-900 dark:text-[#fafafa]">
                        {exp.role} <span className="text-slate-800 dark:text-[#a1a1aa]">@ {exp.company}</span>
                      </h5>

                      <p className="text-xs text-slate-800 dark:text-[#a1a1aa] leading-relaxed pt-2 border-t border-slate-200 dark:border-[#27272a] font-medium">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-[#27272a] space-y-3">
                  <span className="text-xs font-mono font-bold text-orange-700 dark:text-[#f97316] block uppercase">Academic & Project Experience</span>
                  <h5 className="text-lg font-bold text-slate-900 dark:text-[#fafafa]">Full Stack MERN Developer</h5>
                  <p className="text-xs text-slate-800 dark:text-[#a1a1aa] leading-relaxed font-medium">
                    Built 5+ production-grade MERN applications including authentication, admin CMS systems, state management, and cloud APIs. Focused on product-based software engineering benchmarks.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
