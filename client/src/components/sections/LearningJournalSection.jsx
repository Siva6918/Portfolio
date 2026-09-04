import React from "react";
import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";

const easeCurve = [0.16, 1, 0.3, 1];

const palette = [
  { hex: "#2dd4bf", glow: "rgba(45,212,191,0.35)",  shadow: "rgba(45,212,191,0.12)"  },
  { hex: "#38bdf8", glow: "rgba(56,189,248,0.35)",  shadow: "rgba(56,189,248,0.12)"  },
  { hex: "#c084fc", glow: "rgba(192,132,252,0.35)", shadow: "rgba(192,132,252,0.12)" },
  { hex: "#fb923c", glow: "rgba(251,146,60,0.35)",  shadow: "rgba(251,146,60,0.12)"  },
];

const statusColor = {
  "In Progress": "#4ade80",
  "Advanced":    "#facc15",
  "Exploring":   "#38bdf8",
};

const learningTopics = [
  { topic: "Data Structures & Algorithms (Java)", status: "In Progress", note: "Active practice in Dynamic Programming, Graphs, and Tree Traversal routines on LeetCode.", tag: "CORE CS" },
  { topic: "System Design & Scalable Architecture",   status: "In Progress", note: "Studying distributed caching with Redis, Database Indexing, and Load Balancing strategies.",         tag: "BACKEND"    },
  { topic: "Full Stack MERN & Next.js 14",            status: "Advanced",    note: "Building responsive apps with Server-Side Rendering (SSR), App Router, and JWT Auth.",                tag: "FULL STACK"  },
  { topic: "AI / ML & RAG Pipeline Integration",      status: "Exploring",   note: "Integrating Python FastAPI microservices, spaCy NLP parsing, and vector search embeddings.",          tag: "AI ENGINE"   },
];

const LearningJournalSection = () => (
  <section id="journal" className="py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
    <div className="absolute top-1/3 left-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(45,212,191,0.05)" }} />
    <div className="absolute bottom-1/3 right-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(192,132,252,0.05)" }} />

    <div className="section-container relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
        <div>
          <motion.span initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: easeCurve }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-xs font-mono tracking-widest text-teal-600 dark:text-teal-400 uppercase font-semibold mb-3">
            <BookMarked className="w-3.5 h-3.5" />08 // CONTINUOUS LEARNING
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Currently{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-400 to-purple-400">Learning Journal</span>
          </motion.h2>
          <p className="text-sm font-mono text-zinc-400 mt-2">Authentic technical focus areas and ongoing growth topics for 2026.</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {learningTopics.map((item, idx) => {
          const c = palette[idx % palette.length];
          return (
            <motion.div key={item.topic}
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: idx * 0.09, ease: easeCurve }}
              className="rounded-2xl border overflow-hidden flex flex-col justify-between space-y-4 transition-all duration-300"
              style={{ background: "rgba(9,9,11,0.85)", borderColor: "rgba(63,63,70,0.65)", minHeight: "180px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.hex; e.currentTarget.style.boxShadow = `0 8px 32px -6px ${c.shadow}`; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.65)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
              <div className="h-0.5" style={{ background: `linear-gradient(90deg,${c.hex},${c.hex}22)` }} />
              <div className="px-6 pt-5 pb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md border" style={{ background: `${c.hex}14`, color: c.hex, borderColor: `${c.hex}35` }}>
                    [{item.tag}]
                  </span>
                  <span className="text-[11px] font-mono font-bold flex items-center gap-1" style={{ color: statusColor[item.status] || c.hex }}>
                    ● {item.status}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white">{item.topic}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.note}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default LearningJournalSection;
