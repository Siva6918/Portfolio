import React from "react";
import { motion } from "framer-motion";
import { User, Target, Cpu, MapPin, GraduationCap, Calendar, CheckCircle2, Flame, Crosshair } from "lucide-react";

const easeCurve = [0.16, 1, 0.3, 1];

const metrics = [
  { icon: GraduationCap, label: "College",             key: "college",         fallback: "RGMCET",                   color: "#f59e0b" },
  { icon: Calendar,      label: "Graduation",          key: "graduationYear",  fallback: "2027",                     color: "#e2e8f0" },
  { icon: CheckCircle2,  label: "B.Tech CGPA",         key: "cgpa",            fallback: "8.1",                      color: "#f43f5e" },
  { icon: Flame,         label: "Free Fire Rank",      key: "gamingTier",      fallback: "Heroic / Clutch Tactician",color: "#f43f5e" },
  { icon: MapPin,        label: "Location",            key: "location",        fallback: "Andhra Pradesh, India",    color: "#fbbf24" },
];

const AboutSection = ({ profile }) => {
  const longBio     = profile?.longBio     || "Computer Science student and competitive Free Fire player capable of building scalable full-stack applications, designing robust backend architectures, and integrating AI/ML solutions into modern web platforms.";
  const careerGoal  = profile?.careerGoal  || "Become a high-impact software engineer building resilient, scalable web architectures and AI-driven production products.";
  const currentFocus= profile?.currentFocus|| "MERN Stack, Data Structures & Algorithms, Cloud Infrastructure, AI & Real-Time Telemetry";

  return (
    <section id="about" className="py-24 relative w-full bg-transparent overflow-hidden">
      <div className="absolute top-1/3 left-8 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(245,158,11,0.06)" }} />
      <div className="absolute bottom-1/3 right-8 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(244,63,94,0.06)" }} />

      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.4, ease: easeCurve }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", boxShadow: "0 0 24px rgba(245,158,11,0.2)" }}>
            <Flame className="w-6 h-6 text-marigold" />
          </motion.div>
          <div>
            <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.4, ease: easeCurve }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marigold/10 border border-marigold/30 text-xs font-mono tracking-widest text-marigold uppercase font-semibold mb-1">
              01.5 // OPERATOR PROFILE
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.08, ease: easeCurve }}
              className="text-2xl sm:text-3xl font-extrabold text-iceSilver tracking-tight">
              Development Vision &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-marigold via-neonRose to-iceSilver">Tactical Mindset</span>
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
            style={{ background: "rgba(8,8,10,0.92)", borderColor: "rgba(36,40,52,0.8)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#f59e0b"; e.currentTarget.style.boxShadow = "0 10px 40px -8px rgba(245,158,11,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(36,40,52,0.8)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div className="h-0.5" style={{ background: "linear-gradient(90deg,#f59e0b,#f43f5e,#e2e8f0,transparent 70%)" }} />
            <div className="p-7 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border" style={{ background: "#f59e0b16", color: "#f59e0b", borderColor: "#f59e0b35" }}>
                  OVERVIEW
                </span>
                <h4 className="text-lg font-extrabold text-iceSilver">Who I Am</h4>
              </div>
              <p className="text-iceSilver-dark leading-relaxed text-sm font-medium font-mono">{longBio}</p>
              <div className="pt-4 border-t space-y-4" style={{ borderColor: "rgba(36,40,52,0.6)" }}>
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border" style={{ background: "rgba(245,158,11,0.15)", borderColor: "rgba(245,158,11,0.35)", boxShadow: "0 0 14px rgba(245,158,11,0.15)" }}>
                    <Target className="w-4 h-4 text-marigold" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono font-bold uppercase text-marigold mb-0.5">Career Goal</span>
                    <p className="text-sm font-semibold text-iceSilver">{careerGoal}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border" style={{ background: "rgba(244,63,94,0.15)", borderColor: "rgba(244,63,94,0.35)", boxShadow: "0 0 14px rgba(244,63,94,0.15)" }}>
                    <Cpu className="w-4 h-4 text-neonRose" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono font-bold uppercase text-neonRose mb-0.5">Current Focus</span>
                    <p className="text-sm font-semibold text-iceSilver">{currentFocus}</p>
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
              style={{ background: "rgba(8,8,10,0.92)", borderColor: "rgba(36,40,52,0.8)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#f43f5e"; e.currentTarget.style.boxShadow = "0 10px 40px -8px rgba(244,63,94,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(36,40,52,0.8)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="h-0.5" style={{ background: "linear-gradient(90deg,#f43f5e,#f59e0b,transparent 70%)" }} />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(36,40,52,0.6)" }}>
                  <h4 className="text-base font-extrabold text-iceSilver">Tactical Telemetry</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-marigold/35 text-marigold bg-marigold/10 font-bold">VERIFIED</span>
                </div>
                {metrics.map(({ icon: Icon, label, key, fallback, color }) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <span className="text-iceSilver-dark font-medium flex items-center gap-2 text-sm font-mono">
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
              style={{ background: "linear-gradient(135deg,rgba(244,63,94,0.08),rgba(8,8,10,0.95))", borderColor: "rgba(244,63,94,0.35)", boxShadow: "0 4px 24px rgba(244,63,94,0.12)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#f43f5e"; e.currentTarget.style.boxShadow = "0 10px 40px -8px rgba(244,63,94,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(244,63,94,0.35)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(244,63,94,0.12)"; }}>
              <div className="h-0.5" style={{ background: "linear-gradient(90deg,#f43f5e,#f59e0b,transparent 70%)" }} />
              <div className="p-6 space-y-2">
                <span className="font-mono font-bold uppercase text-xs text-neonRose">Engineering & Combat Tenacity</span>
                <p className="text-iceSilver-dark text-sm leading-relaxed font-mono">Write clean, testable code; build secure APIs; measure real-world performance; bring clutch composure and relentless drive to every release.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
