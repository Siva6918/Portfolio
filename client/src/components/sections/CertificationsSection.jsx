import React from 'react';
import { Award, ExternalLink, ShieldCheck } from 'lucide-react';

const CertificationsSection = ({ certifications = [] }) => {
  return (
    <section id="certifications" className="py-20 relative w-full bg-transparent">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#27272a] border border-slate-300 dark:border-[#3f3f46] flex items-center justify-center text-slate-900 dark:text-[#fafafa]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-slate-800 dark:text-[#a1a1aa]">
              Qualifications & Credentials
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#fafafa]">
              Certifications & Accreditations
            </h3>
          </div>
        </div>

        {/* Minimal Timeline / Clean Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certifications.map((cert) => (
            <div
              key={cert._id || cert.title}
              className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-[#27272a] hover:border-purple-500 dark:hover:border-[#8b5cf6]/40 transition-all group space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-700 dark:text-[#8b5cf6] uppercase tracking-wider">
                    {cert.organization}
                  </span>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-[#fafafa] group-hover:text-purple-700 dark:group-hover:text-[#8b5cf6] transition-colors mt-0.5">
                    {cert.title}
                  </h4>
                </div>

                <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-[#8b5cf6]/10 border border-purple-500/20 dark:border-[#8b5cf6]/20 flex items-center justify-center text-purple-700 dark:text-[#8b5cf6] shrink-0 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-slate-800 dark:text-[#a1a1aa] leading-relaxed font-medium">
                {cert.description}
              </p>

              {/* Related Skills */}
              {cert.skills && cert.skills.length > 0 && (
                <div className="pt-2">
                  <span className="block text-[10px] font-mono font-bold uppercase text-slate-800 dark:text-[#a1a1aa] mb-1.5">
                    Verified Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill._id || skill.name}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#18181b] text-[10px] font-mono font-bold text-slate-900 dark:text-[#fafafa] border border-slate-300 dark:border-[#27272a]"
                      >
                        {skill.name || skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-[#27272a] flex items-center justify-between text-xs font-mono font-bold text-slate-800 dark:text-[#a1a1aa]">
                <span>Issued: {cert.issueDate}</span>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sky-700 dark:text-[#7dd3fc] hover:underline"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CertificationsSection;
