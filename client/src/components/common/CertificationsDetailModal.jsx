import React, { useState } from 'react';
import { X, ShieldCheck, ExternalLink, Search, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveMediaUrl } from '../../services/api';
import { useAnalytics } from '../../context/AnalyticsContext';

const CertificationsDetailModal = ({ isOpen, onClose, certifications = [] }) => {
  const { trackInteraction } = useAnalytics();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCerts = certifications.filter((cert) => {
    const q = searchQuery.toLowerCase();
    return (
      cert.title?.toLowerCase().includes(q) ||
      cert.organization?.toLowerCase().includes(q) ||
      cert.description?.toLowerCase().includes(q)
    );
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4 shrink-0">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Verified Cloud & Technical Credentials</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                All Certifications & Badges
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative shrink-0 font-mono text-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, organization (AWS, Udemy, Coursera), or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Certifications Grid */}
          <div className="overflow-y-auto pr-1 flex-1 font-sans">
            {filteredCerts.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                No certifications found matching "{searchQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCerts.map((cert, idx) => {
                  const modalPalette = [
                    { hex: "#4ade80", glow: "rgba(74,222,128,0.25)" },
                    { hex: "#facc15", glow: "rgba(250,204,21,0.25)" },
                    { hex: "#fb923c", glow: "rgba(251,146,60,0.25)" },
                    { hex: "#38bdf8", glow: "rgba(56,189,248,0.25)" },
                    { hex: "#f472b6", glow: "rgba(244,114,182,0.25)" },
                    { hex: "#c084fc", glow: "rgba(192,132,252,0.25)" },
                    { hex: "#2dd4bf", glow: "rgba(45,212,191,0.25)" },
                  ];
                  const c = modalPalette[idx % modalPalette.length];

                  return (
                    <div
                      key={cert._id || cert.title || idx}
                      className="rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300"
                      style={{
                        background: "rgba(9,9,11,0.92)",
                        borderColor: "rgba(63,63,70,0.6)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = c.hex;
                        e.currentTarget.style.boxShadow = `0 8px 30px -6px ${c.glow}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {/* Top accent line */}
                      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${c.hex}, transparent 70%)` }} />

                      <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span
                              className="text-[11px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full border"
                              style={{ background: `${c.hex}14`, color: c.hex, borderColor: `${c.hex}40` }}
                            >
                              {cert.organization}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                              <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                            </span>
                          </div>

                          {/* Certificate uncropped preview */}
                          {cert.image && (
                            <div className="w-full h-44 rounded-xl overflow-hidden bg-[#07070a] border border-zinc-800/80 flex items-center justify-center p-2">
                              <img
                                src={resolveMediaUrl(cert.image)}
                                alt={cert.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}

                          <h3 className="text-base font-extrabold text-white">
                            {cert.title}
                          </h3>

                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {cert.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
                          <span>Issued: {cert.issueDate}</span>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => trackInteraction('certification_click', cert.title, 'Certifications', { url: cert.credentialUrl })}
                              className="flex items-center gap-1 font-bold hover:underline"
                              style={{ color: c.hex }}
                            >
                              <span>Verify</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0 font-mono text-xs">
            <span className="text-slate-500">
              Showing {filteredCerts.length} of {certifications.length} Credentials
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-md"
            >
              Close View
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CertificationsDetailModal;
