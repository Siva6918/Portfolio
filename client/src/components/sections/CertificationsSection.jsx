import React, { useState, useEffect, useCallback, useRef } from "react";
import { ShieldCheck, Eye, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { motion } from "framer-motion";
import { resolveMediaUrl } from "../../services/api";
import CertificationsDetailModal from "../common/CertificationsDetailModal";

const easeCurve = [0.16, 1, 0.3, 1];

const palette = [
  { hex: "#4ade80", glow: "rgba(74,222,128,0.35)",  shadow: "rgba(74,222,128,0.15)"  },
  { hex: "#facc15", glow: "rgba(250,204,21,0.35)",  shadow: "rgba(250,204,21,0.15)"  },
  { hex: "#fb923c", glow: "rgba(251,146,60,0.35)",  shadow: "rgba(251,146,60,0.15)"  },
  { hex: "#38bdf8", glow: "rgba(56,189,248,0.35)",  shadow: "rgba(56,189,248,0.15)"  },
  { hex: "#f472b6", glow: "rgba(244,114,182,0.35)", shadow: "rgba(244,114,182,0.15)" },
  { hex: "#c084fc", glow: "rgba(192,132,252,0.35)", shadow: "rgba(192,132,252,0.15)" },
  { hex: "#2dd4bf", glow: "rgba(45,212,191,0.35)",  shadow: "rgba(45,212,191,0.15)"  },
  { hex: "#fb7185", glow: "rgba(251,113,133,0.35)", shadow: "rgba(251,113,133,0.15)" },
];

const defaultCerts = [
  { _id: "1", title: "AWS Certified Cloud Practitioner",               organization: "Amazon Web Services", issueDate: "2024", credentialId: "AWS-CCP-100293", credentialUrl: "https://aws.amazon.com/verification", description: "Validated foundational AWS Cloud architecture, IAM, EC2, S3, and RDS." },
  { _id: "2", title: "Full Stack Web Development with Node.js & React", organization: "Udemy / Coursera",   issueDate: "2024", credentialId: "FSWD-98214",     credentialUrl: "",                                   description: "Mastered MERN architecture, REST API design, and state management." },
  { _id: "3", title: "Data Structures & Algorithms",                   organization: "GeeksforGeeks",       issueDate: "2023", credentialId: "GFG-DSA-4421",   credentialUrl: "",                                   description: "300+ problems in Arrays, DP, Graphs, Trees — optimal complexity." },
  { _id: "4", title: "React — The Complete Guide",                     organization: "Udemy",               issueDate: "2024", credentialId: "UC-9182734",     credentialUrl: "",                                   description: "Hooks, Redux, Router, Context API, and advanced React patterns." },
  { _id: "5", title: "MongoDB & Mongoose Complete Course",             organization: "Coursera",            issueDate: "2024", credentialId: "MONGO-73891",    credentialUrl: "",                                   description: "Schema design, aggregation pipelines, indexing, Atlas cloud." },
];

const wrap = (idx, len) => ((idx % len) + len) % len;

const CertificationsSection = ({ certifications = [] }) => {
  const certs       = certifications.length > 0 ? certifications : defaultCerts;
  const total       = certs.length;
  const [active, setActive]         = useState(0);
  const [isModalOpen, setModal]     = useState(false);
  const [paused, setPaused]         = useState(false);
  const intervalRef                 = useRef(null);

  const prev = useCallback(() => setActive(c => wrap(c - 1, total)), [total]);
  const next = useCallback(() => setActive(c => wrap(c + 1, total)), [total]);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 3500);
    return () => clearInterval(intervalRef.current);
  }, [next, paused]);

  const color = palette[active % palette.length];

  return (
    <section
      id="certifications"
      className="py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden"
    >
      <div className="absolute top-1/3 left-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(56,189,248,0.05)" }} />
      <div className="absolute bottom-1/3 right-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(192,132,252,0.05)" }} />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease: easeCurve }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-xs font-mono tracking-widest text-teal-600 dark:text-teal-400 uppercase font-semibold mb-3"
            >
              <Award className="w-3.5 h-3.5" />06 // CREDENTIALS & CERTIFICATIONS
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              Verified{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-400 to-purple-400">
                Certifications
              </span>
            </motion.h2>
            <p className="text-sm font-mono text-slate-600 dark:text-zinc-400 mt-2">
              Industry-recognised credentials validating engineering depth.
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-mono text-xs font-semibold shadow-lg active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg,#2dd4bf,#c084fc)", boxShadow: "0 6px 24px rgba(45,212,191,0.25)" }}
          >
            <Eye className="w-3.5 h-3.5" /><span>SEE ALL DETAILS ({total})</span>
          </button>
        </div>

        {/* ══ DESKTOP 3-slide image-only carousel with SIDE ARROWS ══ */}
        <div
          className="hidden md:block"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative flex items-center gap-0">
            {/* LEFT ARROW — pinned to left side */}
            <button
              onClick={prev}
              className="shrink-0 w-12 h-12 rounded-full border flex items-center justify-center z-20 transition-all duration-200 hover:scale-110 active:scale-95 mr-4"
              style={{
                background: `${color.hex}15`,
                borderColor: `${color.hex}40`,
                color: color.hex,
                boxShadow: `0 0 16px ${color.shadow}`,
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* 3-card track: prev | active | next */}
            <div className="flex-1 flex items-center gap-4 overflow-hidden">
              {[-1, 0, 1].map((offset) => {
                const idx   = wrap(active + offset, total);
                const cert  = certs[idx];
                const c     = palette[idx % palette.length];
                const isCenter = offset === 0;

                return (
                  <div
                    key={idx}
                    onClick={() => !isCenter && setActive(idx)}
                    className="relative rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer"
                    style={{
                      flex: isCenter ? "0 0 50%" : "0 0 25%",
                      height: isCenter ? "340px" : "240px",
                      borderColor: isCenter ? c.hex : `${c.hex}30`,
                      boxShadow: isCenter ? `0 16px 48px -8px ${c.glow}` : "none",
                      opacity: isCenter ? 1 : 0.6,
                      transform: isCenter ? "scale(1)" : "scale(0.96)",
                      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {/* Certificate image without cropping */}
                    {cert.image ? (
                      <div className="w-full h-full flex items-center justify-center p-2 bg-[#08080b]">
                        <img
                          src={resolveMediaUrl(cert.image)}
                          alt={cert.title}
                          className="w-full h-full object-contain"
                          style={{ transform: isCenter ? "scale(1.02)" : "scale(1)", transition: "transform 0.5s ease" }}
                        />
                      </div>
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-4"
                        style={{ background: `linear-gradient(135deg, ${c.hex}20, rgba(9,9,11,0.96))` }}
                      >
                        <div
                          className="w-20 h-20 rounded-3xl flex items-center justify-center"
                          style={{
                            background: `${c.hex}25`,
                            border: `2px solid ${c.hex}55`,
                            boxShadow: isCenter ? `0 0 32px ${c.glow}` : "none",
                          }}
                        >
                          <ShieldCheck className="w-10 h-10" style={{ color: c.hex }} />
                        </div>
                        {isCenter && (
                          <>
                            <span className="text-sm font-bold text-white text-center px-4">{cert.title}</span>
                            <span className="text-xs font-mono" style={{ color: `${c.hex}cc` }}>{cert.organization}</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Colored top accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ background: `linear-gradient(90deg,${c.hex},${c.hex}22)` }}
                    />

                    {/* Overlay on center: org + verified badge only */}
                    {isCenter && (
                      <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, rgba(9,9,11,0.92) 60%, transparent)" }}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold" style={{ color: `${c.hex}cc` }}>{cert.organization}</span>
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border" style={{ background: `${c.hex}22`, borderColor: `${c.hex}55`, color: c.hex }}>
                            <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RIGHT ARROW — pinned to right side */}
            <button
              onClick={next}
              className="shrink-0 w-12 h-12 rounded-full border flex items-center justify-center z-20 transition-all duration-200 hover:scale-110 active:scale-95 ml-4"
              style={{
                background: `${color.hex}15`,
                borderColor: `${color.hex}40`,
                color: color.hex,
                boxShadow: `0 0 16px ${color.shadow}`,
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {certs.map((_, i) => {
              const c = palette[i % palette.length];
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:  i === active ? "24px" : "8px",
                    height: "8px",
                    background: i === active ? c.hex : `${c.hex}35`,
                    boxShadow: i === active ? `0 0 8px ${c.glow}` : "none",
                  }}
                />
              );
            })}
          </div>

          {/* Auto-progress bar */}
          <div className="mt-3 max-w-xs mx-auto h-0.5 rounded-full bg-zinc-800/50 overflow-hidden">
            <motion.div
              key={active}
              initial={{ width: "0%" }} animate={{ width: "100%" }}
              transition={{ duration: 3.5, ease: "linear" }}
              className="h-full rounded-full"
              style={{ background: color.hex }}
            />
          </div>
        </div>

        {/* ══ MOBILE — single card with side arrows ══ */}
        <div className="block md:hidden">
          <div className="flex items-center gap-3">
            {/* Left arrow */}
            <button
              onClick={prev}
              className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95"
              style={{ background: `${color.hex}15`, borderColor: `${color.hex}40`, color: color.hex }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Card — image only */}
            <div
              className="flex-1 relative rounded-2xl overflow-hidden border"
              style={{
                height: "280px",
                borderColor: color.hex,
                boxShadow: `0 12px 40px -8px ${color.shadow}`,
              }}
            >
              {certs[active].image ? (
                <div className="w-full h-full flex items-center justify-center p-2 bg-[#08080b]">
                  <img src={resolveMediaUrl(certs[active].image)} alt={certs[active].title} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ background: `linear-gradient(135deg,${color.hex}20,rgba(9,9,11,0.97))` }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${color.hex}25`, border: `2px solid ${color.hex}55`, boxShadow: `0 0 24px ${color.glow}` }}>
                    <ShieldCheck className="w-8 h-8" style={{ color: color.hex }} />
                  </div>
                  <span className="text-sm font-bold text-white text-center px-6">{certs[active].title}</span>
                </div>
              )}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg,${color.hex},${color.hex}22)` }} />
              <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: "linear-gradient(to top,rgba(9,9,11,0.92) 60%,transparent)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold" style={{ color: `${color.hex}cc` }}>{certs[active].organization}</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border" style={{ background: `${color.hex}22`, borderColor: `${color.hex}55`, color: color.hex }}>
                    <ShieldCheck className="w-2 h-2" /> VERIFIED
                  </span>
                </div>
              </div>
            </div>

            {/* Right arrow */}
            <button
              onClick={next}
              className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95"
              style={{ background: `${color.hex}15`, borderColor: `${color.hex}40`, color: color.hex }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots + counter */}
          <div className="flex justify-center gap-2 mt-4">
            {certs.map((_, i) => {
              const c = palette[i % palette.length];
              return (
                <button key={i} onClick={() => setActive(i)} className="rounded-full transition-all duration-300"
                  style={{ width: i === active ? "20px" : "7px", height: "7px", background: i === active ? c.hex : `${c.hex}35`, boxShadow: i === active ? `0 0 8px ${c.glow}` : "none" }}
                />
              );
            })}
          </div>
          <p className="text-center text-xs font-mono text-zinc-500 mt-2">{active + 1} / {total}</p>
        </div>

        <CertificationsDetailModal isOpen={isModalOpen} onClose={() => setModal(false)} certifications={certs} />
      </div>
    </section>
  );
};

export default CertificationsSection;
