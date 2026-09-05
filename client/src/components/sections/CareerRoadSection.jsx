import React, { useState } from "react";
import {
  GraduationCap, Cpu, Code2, FlaskConical, Briefcase, Rocket, Trophy, Target,
  Eye, ChevronLeft, ChevronRight, ArrowRight, CheckCircle2, Flame, Sparkles, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CareerRoadDetailModal from "../common/CareerRoadDetailModal";

const easeCurve = [0.16, 1, 0.3, 1];

const iconMap = {
  GraduationCap, Cpu, Code2, FlaskConical, Briefcase, Rocket, Trophy, Target
};

export const stepColorPalette = [
  { name: "Light Green", hex: "#4ade80", glow: "rgba(74,222,128,0.4)",  shadow: "rgba(74,222,128,0.18)"  },
  { name: "Yellow",      hex: "#facc15", glow: "rgba(250,204,21,0.4)",  shadow: "rgba(250,204,21,0.18)"  },
  { name: "Orange",      hex: "#fb923c", glow: "rgba(251,146,60,0.4)",  shadow: "rgba(251,146,60,0.18)"  },
  { name: "Blue",        hex: "#38bdf8", glow: "rgba(56,189,248,0.4)",  shadow: "rgba(56,189,248,0.18)"  },
  { name: "Pink",        hex: "#f472b6", glow: "rgba(244,114,182,0.4)", shadow: "rgba(244,114,182,0.18)" },
  { name: "Purple",      hex: "#c084fc", glow: "rgba(192,132,252,0.4)", shadow: "rgba(192,132,252,0.18)" },
  { name: "Teal",        hex: "#2dd4bf", glow: "rgba(45,212,191,0.4)",  shadow: "rgba(45,212,191,0.18)"  },
  { name: "Rose",        hex: "#fb7185", glow: "rgba(251,113,133,0.4)", shadow: "rgba(251,113,133,0.18)" },
];

const defaultNodes = [
  { id: 0, year: "2023",    title: "Education",         subtitle: "B.Tech CSE — RGMCET",              desc: "Core CS fundamentals, 8.1 CGPA.",                                 status: "completed", icon: GraduationCap },
  { id: 1, year: "2023–24", title: "DSA & Programming", subtitle: "300+ Problems Solved",              desc: "Arrays, DP, Graphs, Trees — optimal time-space complexity.",      status: "completed", icon: Cpu           },
  { id: 2, year: "2024",    title: "MERN Stack",        subtitle: "React, Node.js, Express, MongoDB",  desc: "Production full-stack web applications & REST APIs.",              status: "completed", icon: Code2         },
  { id: 3, year: "2024–25", title: "Internships",       subtitle: "Software Engineering Experience",   desc: "Full-stack development, cloud backends, API design.",              status: "active",    icon: Briefcase     },
  { id: 4, year: "2025",    title: "Projects",          subtitle: "Production Deployments",            desc: "NutriCloud, DocSpot, Candidate Rank — full-stack apps.",           status: "active",    icon: FlaskConical  },
  { id: 5, year: "2025–26", title: "Certifications",    subtitle: "Industry Credentials",              desc: "Cloud & software engineering certifications.",                     status: "completed", icon: Trophy        },
  { id: 6, year: "2026",    title: "AI & Cloud",        subtitle: "FastAPI, OpenAI, AWS",              desc: "AI-powered tools, containerization, cloud services.",              status: "future",    icon: Rocket        },
  { id: 7, year: "2027",    title: "Software Engineer", subtitle: "Target: Product-Based Company",     desc: "Scalable web & AI product engineering.",                          status: "future",    icon: Target        },
];

const getStatusMeta = (status) => {
  if (status === "completed") return { label: "Completed", color: "#4ade80", Icon: CheckCircle2, pulse: false };
  if (status === "active")    return { label: "Active",    color: "#facc15", Icon: Flame,        pulse: true  };
  return                             { label: "Upcoming",  color: "#c084fc", Icon: Sparkles,     pulse: false };
};

const STEP_INDENT = 48;

const CareerRoadSection = ({ careerNodes = [] }) => {
  const [activeIdx, setActiveIdx]   = useState(0);
  const [isModalOpen, setModal]     = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const roadNodes = careerNodes.length > 0
    ? careerNodes.map((n, i) => ({
        id: n._id || i, year: n.year, title: n.title,
        subtitle: n.subtitle, desc: n.description,
        status: n.status || "future", icon: iconMap[n.icon] || Target,
      }))
    : defaultNodes;

  const total = roadNodes.length;

  return (
    <section id="career-road" className="py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }} transition={{ duration: 0.5, ease: easeCurve }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-semibold mb-3"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>05.1 // STAIRCASE TIMELINE</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }} transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              Engineering{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-400 via-pink-400 to-purple-400">
                Progression Staircase
              </span>
            </motion.h2>
            <p className="text-sm font-mono text-slate-600 dark:text-zinc-400 mt-2 max-w-xl">
              Ascending milestone by milestone — from algorithms to cloud-scale product engineering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }} transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
              className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-2xl bg-slate-100/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono backdrop-blur-md"
            >
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-white/60"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-emerald-400/60 shadow-sm" /> Done</span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-white/60"><span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-yellow-400/60 shadow-sm" /> Active</span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-white/60"><span className="w-2 h-2 rounded-full bg-purple-400 shadow-purple-400/60 shadow-sm" /> Upcoming</span>
            </motion.div>
            <button
              onClick={() => setModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono text-xs font-semibold shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5" /><span>VIEW FULL TIMELINE</span>
            </button>
          </div>
        </div>

        {/* ══ DESKTOP STAIRCASE ══ */}
        <div className="hidden sm:block">
          {roadNodes.map((node, idx) => {
            const IconComp  = node.icon || Target;
            const color     = stepColorPalette[idx % stepColorPalette.length];
            const { label, color: sColor, Icon: SIcon, pulse } = getStatusMeta(node.status);
            const stepNum   = String(idx + 1).padStart(2, "0");
            const isHov     = hoveredIdx === idx;
            const indent    = idx * STEP_INDENT;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -36, y: 8 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: easeCurve }}
                className="relative flex items-stretch"
                style={{ paddingLeft: `${indent}px` }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* L-shaped stair connector */}
                {idx > 0 && (
                  <div
                    className="absolute pointer-events-none transition-all duration-300"
                    style={{
                      left:  `${indent - STEP_INDENT}px`,
                      top:   0,
                      width: `${STEP_INDENT}px`,
                      height: "52%",
                      borderRight: `2px solid ${isHov ? color.hex : "rgba(113,113,122,0.2)"}`,
                      borderBottom: `2px solid ${isHov ? color.hex : "rgba(113,113,122,0.2)"}`,
                      borderBottomRightRadius: "10px",
                    }}
                  />
                )}

                {/* Colored riser bar */}
                <div
                  className="shrink-0 w-1.5 rounded-t-full my-2 mr-4 transition-all duration-300"
                  style={{
                    background: `linear-gradient(to bottom, ${color.hex}, ${color.hex}22)`,
                    opacity: isHov ? 1 : 0.55,
                    boxShadow: isHov ? `0 0 14px 3px ${color.shadow}` : "none",
                  }}
                />

                {/* Card */}
                <div
                  className="flex-1 mb-3 rounded-2xl border overflow-hidden transition-all duration-300"
                  style={{
                    background: isHov
                      ? `linear-gradient(135deg, ${color.hex}14 0%, rgba(9,9,11,0.96) 100%)`
                      : "rgba(9,9,11,0.82)",
                    borderColor: isHov ? `${color.hex}` : "rgba(63,63,70,0.65)",
                    boxShadow: isHov ? `0 8px 36px -6px ${color.shadow}, 0 0 0 1px ${color.hex}28` : "0 2px 10px rgba(0,0,0,0.3)",
                    transform: isHov ? "translateY(-2px)" : "translateY(0)",
                  }}
                >
                  {/* Accent top line */}
                  <div
                    className="h-0.5 w-full"
                    style={{ background: `linear-gradient(90deg, ${color.hex}${isHov ? "ff" : "55"}, transparent 65%)` }}
                  />

                  <div className="p-5 flex flex-col md:flex-row md:items-center gap-5">

                    {/* Icon + Step badge */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
                        style={{
                          background: `${color.hex}${isHov ? "28" : "16"}`,
                          border: `1.5px solid ${color.hex}${isHov ? "80" : "35"}`,
                          boxShadow: isHov ? `0 0 18px ${color.shadow}` : "none",
                        }}
                      >
                        <IconComp className="w-5 h-5" style={{ color: color.hex }} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span
                          className="text-[10px] font-mono font-black uppercase tracking-[0.14em] px-2 py-0.5 rounded-full border"
                          style={{ background: `${color.hex}16`, color: color.hex, borderColor: `${color.hex}35` }}
                        >
                          STEP {stepNum}
                        </span>
                        <span
                          className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border"
                          style={{ background: `${color.hex}10`, color: `${color.hex}bb`, borderColor: `${color.hex}22` }}
                        >
                          {node.year}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px self-stretch" style={{ background: `${color.hex}22` }} />

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{node.title}</h3>
                      <p className="text-xs font-mono font-semibold" style={{ color: `${color.hex}cc` }}>{node.subtitle}</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">{node.desc || node.description}</p>
                    </div>

                    {/* Status */}
                    <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0 md:border-l md:pl-5 md:border-zinc-800/60">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border"
                        style={{ background: `${sColor}14`, color: sColor, borderColor: `${sColor}40` }}
                      >
                        <SIcon className={`w-3.5 h-3.5 ${pulse ? "animate-pulse" : ""}`} style={{ color: sColor }} />
                        {label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-600 whitespace-nowrap">
                        Tier {idx + 1} / {total}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Rainbow baseline */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: false }} transition={{ duration: 1.2, delay: 0.6, ease: easeCurve }}
            className="mt-1 h-px origin-left"
            style={{
              marginLeft: `${(total - 1) * STEP_INDENT + 6}px`,
              background: "linear-gradient(90deg,#4ade8060,#facc1560,#fb923c60,#38bdf860,#f472b660,#c084fc60,transparent)",
            }}
          />
        </div>

        {/* ══ MOBILE CARD DECK ══ */}
        <div className="block sm:hidden max-w-sm mx-auto">

          {/* Step progress dots */}
          <div className="flex gap-1.5 mb-4 justify-center">
            {roadNodes.map((_, i) => {
              const c = stepColorPalette[i % stepColorPalette.length];
              return (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:  i === activeIdx ? "20px" : "8px",
                    height: "8px",
                    background: i === activeIdx ? c.hex : i < activeIdx ? `${c.hex}55` : "rgba(63,63,70,0.5)",
                    boxShadow: i === activeIdx ? `0 0 8px ${c.glow}` : "none",
                  }}
                />
              );
            })}
          </div>

          {/* Step progress bar */}
          <div className="flex gap-0.5 mb-5 h-1 rounded-full overflow-hidden bg-zinc-800/40">
            {roadNodes.map((_, i) => {
              const c = stepColorPalette[i % stepColorPalette.length];
              return (
                <div
                  key={i}
                  className="flex-1 transition-all duration-500"
                  style={{
                    background: i <= activeIdx ? c.hex : "transparent",
                    opacity: i <= activeIdx ? 1 : 0.2,
                  }}
                />
              );
            })}
          </div>

          {/* Animated card */}
          <AnimatePresence mode="wait">
            {(() => {
              const node   = roadNodes[activeIdx];
              const IconC  = node.icon || Target;
              const color  = stepColorPalette[activeIdx % stepColorPalette.length];
              const { label, color: sColor, Icon: SIcon, pulse } = getStatusMeta(node.status);
              const stepN  = String(activeIdx + 1).padStart(2, "0");
              return (
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{    opacity: 0, y: -18, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: easeCurve }}
                  className="rounded-3xl border overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${color.hex}12 0%, rgba(9,9,11,0.97) 100%)`,
                    borderColor: `${color.hex}50`,
                    boxShadow: `0 10px 40px -8px ${color.shadow}`,
                  }}
                >
                  <div className="h-1" style={{ background: `linear-gradient(90deg,${color.hex},${color.hex}22)` }} />
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center border"
                          style={{ background: `${color.hex}22`, borderColor: `${color.hex}45`, boxShadow: `0 0 14px ${color.shadow}` }}
                        >
                          <IconC className="w-4 h-4" style={{ color: color.hex }} />
                        </div>
                        <div>
                          <span className="block text-[10px] font-mono font-black uppercase tracking-widest" style={{ color: color.hex }}>STEP {stepN}</span>
                          <span className="block text-[11px] font-mono" style={{ color: `${color.hex}99` }}>{node.year}</span>
                        </div>
                      </div>
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border"
                        style={{ background: `${sColor}14`, color: sColor, borderColor: `${sColor}40` }}
                      >
                        <SIcon className={`w-3 h-3 ${pulse ? "animate-pulse" : ""}`} style={{ color: sColor }} />
                        {label}
                      </span>
                    </div>
                    {/* Body */}
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-extrabold text-white">{node.title}</h3>
                      <p className="text-xs font-mono font-semibold" style={{ color: `${color.hex}cc` }}>{node.subtitle}</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{node.desc || node.description}</p>
                    </div>
                    {/* Footer */}
                    <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-600">{activeIdx + 1} of {total} steps</span>
                      <button onClick={() => setModal(true)} className="font-bold flex items-center gap-1 hover:underline" style={{ color: color.hex }}>
                        View All <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setActiveIdx(p => (p - 1 + total) % total)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-zinc-300 hover:bg-zinc-800 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-xs font-mono text-zinc-500">{activeIdx + 1} / {total}</span>
            <button
              onClick={() => setActiveIdx(p => (p + 1) % total)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-zinc-300 hover:bg-zinc-800 active:scale-95 transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal */}
        <CareerRoadDetailModal isOpen={isModalOpen} onClose={() => setModal(false)} nodes={roadNodes} />
      </div>
    </section>
  );
};

export default CareerRoadSection;
