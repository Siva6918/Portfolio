import React from "react";
import { ExternalLink, BookOpen, Code2, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useAnalytics } from "../../context/AnalyticsContext";
import SectionHeader from "../common/SectionHeader";

const easeCurve = [0.16, 1, 0.3, 1];

const cards = [
  {
    num: "01", icon: BookOpen, color: "#c084fc",
    title: "WHO I AM",
    body: "Computer Science student at Rajeev Gandhi Memorial College (graduating 2027, CGPA 8.1). I build modern full-stack architectures, clean APIs, and integrate real-time intelligence into products.",
    footer: { left: "AP, India", right: "CGPA 8.1", rightColor: "#4ade80" }
  },
  {
    num: "02", icon: Code2, color: "#facc15",
    title: "WHAT I'M LEARNING",
    listItems: ["Data Structures & Algorithms (Java)", "Production MERN Stack Architecture", "System Design & Scalable APIs", "AI / ML FastAPI Integration"],
    footer: { left: "LeetCode: 300+", right: "HackerRank 5★", rightColor: "#facc15" }
  },
  {
    num: "03", icon: Rocket, color: "#38bdf8",
    title: "WHERE I'M HEADED",
    body: "Seeking software engineering roles where I can contribute to core platform features, solve complex algorithmic challenges, and collaborate with high-performance teams.",
    link: true
  },
];

const DigitalCampusSection = ({ profile, education = [] }) => {
  const { trackInteraction } = useAnalytics();
  const collegeName = profile?.educationSummary?.college || profile?.college || "Rajeev Gandhi Memorial College of Engineering and Technology";
  const collegeUrl  = profile?.collegeUrl || "https://www.rgmcet.edu.in/";

  return (
    <section id="about" className="py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
      <div className="absolute top-1/3 left-8 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(192,132,252,0.05)" }} />
      <div className="absolute bottom-1/3 right-8 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(56,189,248,0.05)" }} />

      <div className="section-container relative z-10">
        {/* Header with Color-Sparked Card Pill & Space Grotesk */}
        <SectionHeader
          badgeText="01 // BACKGROUND & PHILOSOPHY"
          icon={BookOpen}
          color="#c084fc"
          title="Who I Am & "
          gradientTitle="How I Work"
          description="Software engineering student focused on building robust products with high craftsmanship."
        />

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, idx) => (
            <motion.div key={card.num}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.55, delay: idx * 0.1, ease: easeCurve }}
              className="rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300"
              style={{ background: "rgba(9,9,11,0.85)", borderColor: "rgba(63,63,70,0.65)", minHeight: "260px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = card.color; e.currentTarget.style.boxShadow = `0 8px 32px -6px ${card.color}30`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.65)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="h-0.5" style={{ background: `linear-gradient(90deg,${card.color},${card.color}22)` }} />
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all"
                    style={{ background: `${card.color}18`, borderColor: `${card.color}40`, boxShadow: `0 0 16px ${card.color}20` }}
                  >
                    <card.icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border block w-fit mb-1"
                      style={{ background: `${card.color}14`, color: card.color, borderColor: `${card.color}40` }}>STEP {card.num}</span>
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wide">{card.title}</h3>
                  </div>
                </div>
                {card.body && <p className="text-sm text-zinc-300 leading-relaxed flex-1">{card.body}</p>}
                {card.listItems && (
                  <ul className="space-y-2 flex-1">
                    {card.listItems.map(li => (
                      <li key={li} className="flex items-center gap-2 text-xs text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: card.color }} />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="px-6 pb-5 border-t pt-3" style={{ borderColor: `${card.color}20` }}>
                {card.footer && (
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">{card.footer.left}</span>
                    <span className="font-bold" style={{ color: card.footer.rightColor }}>{card.footer.right}</span>
                  </div>
                )}
                {card.link && (
                  <a href={collegeUrl} target="_blank" rel="noreferrer"
                    onClick={() => trackInteraction("college_click", collegeName, "Digital Campus")}
                    className="flex items-center justify-between gap-2 text-xs font-mono transition-colors"
                    style={{ color: `${card.color}cc` }}
                    onMouseEnter={e => e.currentTarget.style.color = card.color}
                    onMouseLeave={e => e.currentTarget.style.color = `${card.color}cc`}>
                    <span className="break-words">{collegeName}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalCampusSection;
