import React from 'react';
import { Award, ExternalLink, ShieldCheck } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';

const CertificationsSection = ({ certifications = [] }) => {
  return (
    <section id="certifications" className="py-16 relative w-full">
      <div className="section-container">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
            <Award className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-mono font-semibold tracking-widest text-[#c4b5fd]">
              Credentials
            </h2>
            <h3 className="text-2xl font-bold text-[#fafafa]">
              Certifications
            </h3>
          </div>
        </div>

        {/* Grid — 3 column desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert) => (
            <div
              key={cert._id || cert.title}
              className="glass-card p-5 rounded-xl space-y-3 group hover:border-[#8b5cf6]/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Certificate Image if available */}
                {cert.image && (
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[#09090b] border border-[#27272a]">
                    <ImageWithFallback
                      src={cert.image}
                      alt={cert.title}
                      updatedAt={cert.updatedAt}
                      fallbackIcon={ShieldCheck}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      containerClassName="w-full h-full"
                    />
                  </div>
                )}

                {/* Org + Verify Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-mono font-semibold text-[#c4b5fd] uppercase tracking-wider block">
                      {cert.organization}
                    </span>
                    <h4 className="text-sm font-bold text-[#fafafa] group-hover:text-[#c4b5fd] transition-colors leading-snug">
                      {cert.title}
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-[#8b5cf6]/10 border border-[#8b5cf6]/15 flex items-center justify-center text-[#8b5cf6] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* Description */}
                {cert.description && (
                  <p className="text-xs text-[#71717a] leading-relaxed line-clamp-2">
                    {cert.description}
                  </p>
                )}

                {/* Skills Tags */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill._id || skill.name || skill}
                        className="px-2 py-0.5 rounded-md bg-[#18181b] text-[9px] font-mono text-[#a1a1aa] border border-[#27272a]"
                      >
                        {skill.name || skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer: Date + Verify Link */}
              <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-[10px] font-mono text-[#52525b]">
                <span>Issued: {cert.issueDate}</span>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#a5b4fc] hover:text-[#c4b5fd] transition-colors font-semibold"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
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
