import React from "react";
import { motion } from "framer-motion";
import { User, Target, Cpu, MapPin, GraduationCap, Calendar, CheckCircle2 } from "lucide-react";

const easeCurve = [0.16, 1, 0.3, 1];

const metrics = [
  { icon: GraduationCap, label: "College",             key: "college",         fallback: "RGMCET",                   color: "#38bdf8" },
  { icon: Calendar,      label: "Graduation",          key: "graduationYear",  fallback: "2027",                     color: "#fb923c" },
  { icon: CheckCircle2,  label: "B.Tech CGPA",         key: "cgpa",            fallback: "8.1",                      color: "#4ade80" },
  { icon: MapPin,        label: "Location",            key: "location",        fallback: "Andhra Pradesh, India",    color: "#c084fc" },
];

const AboutSection = ({ profile }) => {
  const longBio     = profile?.longBio     || "Computer Science student capable of building scalable full-stack applications, designing robust backend architectures, and integrating AI/ML solutions into modern web platforms.";
  const careerGoal  = profile?.careerGoal  || "Become a strong software engineer capable of building scalable applications and integrating AI-driven solutions into modern web platforms.";
  const currentFocus= profile?.currentFocus|| "MERN Stack, Data Structures & Algorithms, Cloud Infrastructure, AI Integration";

  return (
    <section id="about" className="py-24 relative w-full bg-transparent overflow-hidden">
      <div className="absolute top-1/3 left-8 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(250,204,21,0.05)" }} />
      <div className="absolute bottom-1/3 right-8 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(56,189,248,0.05)" }} />

      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.4, ease: easeCurve }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.35)", boxShadow: "0 0 24px rgba(250,204,21,0.18)" }}>
            <User className="w-6 h-6" style={{ color: "#facc15" }} />
          </motion.div>
          <div>
            <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.4, ease: easeCurve }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-xs font-mono tracking-widest text-yellow-600 dark:text-yellow-400 uppercase font-semibold mb-1">
              01.5 // ABOUT ME
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.08, ease: easeCurve }}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Development Vision &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400">Background</span>
            </motion.h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Bio Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="lg:col-span-7 rounded-2xl border overflow-hidden transition-all duration-300"
            style={{ background: "rgba(9,9,11,0.88)", borderColor: "rgba(63,63,70,0.65)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#facc15"; e.currentTarget.style.boxShadow = "0 10px 40px -8px rgba(250,204,21,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.65)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div className="h-0.5" style={{ background: "linear-gradient(90deg,#facc15,#fb923c,#f472b6,transparent 70%)" }} />
            <div className="p-7 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border" style={{ background: "#facc1516", color: "#facc15", borderColor: "#facc1535" }}>
                  OVERVIEW
                </span>
                <h4 className="text-lg font-extrabold text-white">Who I Am</h4>
              </div>
              <p className="text-zinc-300 leading-relaxed text-sm font-medium">{longBio}</p>
              <div className="pt-4 border-t space-y-4" style={{ borderColor: "rgba(63,63,70,0.5)" }}>
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border" style={{ background: "rgba(56,189,248,0.15)", borderColor: "rgba(56,189,248,0.35)", boxShadow: "0 0 14px rgba(56,189,248,0.15)" }}>
                    <Target className="w-4 h-4" style={{ color: "#38bdf8" }} />
                  </div>
                  <div>
                    <span className="block text-xs font-mono font-bold uppercase text-sky-400 mb-0.5">Career Goal</span>
                    <p className="text-sm font-semibold text-white">{careerGoal}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border" style={{ background: "rgba(251,146,60,0.15)", borderColor: "rgba(251,146,60,0.35)", boxShadow: "0 0 14px rgba(251,146,60,0.15)" }}>
                    <Cpu className="w-4 h-4" style={{ color: "#fb923c" }} />
                  </div>
                  <div>
                    <span className="block text-xs font-mono font-bold uppercase text-orange-400 mb-0.5">Current Focus</span>
                    <p className="text-sm font-semibold text-white">{currentFocus}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Metrics + Philosophy */}
          <div className="lg:col-span-5 space-y-5">
            {/* Quick Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.12, ease: easeCurve }}
              className="rounded-2xl border overflow-hidden transition-all duration-300"
              style={{ background: "rgba(9,9,11,0.88)", borderColor: "rgba(63,63,70,0.65)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.boxShadow = "0 10px 40px -8px rgba(74,222,128,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.65)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="h-0.5" style={{ background: "linear-gradient(90deg,#4ade80,#38bdf8,transparent 70%)" }} />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(63,63,70,0.5)" }}>
                  <h4 className="text-base font-extrabold text-white">Quick Metrics</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-bold">VERIFIED</span>
                </div>
                {metrics.map(({ icon: Icon, label, key, fallback, color }) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <span className="text-zinc-300 font-medium flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4 shrink-0" style={{ color }} />{label}
                    </span>
                    <span className="font-mono font-bold text-right text-sm break-words" style={{ color }}>
                      {profile?.[key] || fallback}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Philosophy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.22, ease: easeCurve }}
              className="rounded-2xl border overflow-hidden transition-all duration-300"
              style={{ background: "linear-gradient(135deg,rgba(56,189,248,0.08),rgba(9,9,11,0.95))", borderColor: "rgba(56,189,248,0.35)", boxShadow: "0 4px 24px rgba(56,189,248,0.1)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.boxShadow = "0 10px 40px -8px rgba(56,189,248,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(56,189,248,0.35)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(56,189,248,0.1)"; }}>
              <div className="h-0.5" style={{ background: "linear-gradient(90deg,#38bdf8,transparent 70%)" }} />
              <div className="p-6 space-y-2">
                <span className="font-mono font-bold uppercase text-xs" style={{ color: "#38bdf8" }}>Engineering Philosophy</span>
                <p className="text-zinc-300 text-sm leading-relaxed">Write clean, testable code; build secure APIs; measure real-world performance; treat security as a first-class feature.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
