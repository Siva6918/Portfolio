import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronLeft, ChevronRight, Star } from "lucide-react";
import SectionHeader from "../common/SectionHeader";
import { resolveMediaUrl } from "../../services/api";

const easeCurve = [0.16, 1, 0.3, 1];

const palette = [
  { hex: "#facc15", glow: "rgba(250,204,21,0.4)",  shadow: "rgba(250,204,21,0.18)"  },
  { hex: "#fb923c", glow: "rgba(251,146,60,0.4)",  shadow: "rgba(251,146,60,0.18)"  },
  { hex: "#4ade80", glow: "rgba(74,222,128,0.4)",  shadow: "rgba(74,222,128,0.18)"  },
  { hex: "#f472b6", glow: "rgba(244,114,182,0.4)", shadow: "rgba(244,114,182,0.18)" },
  { hex: "#38bdf8", glow: "rgba(56,189,248,0.4)",  shadow: "rgba(56,189,248,0.18)"  },
  { hex: "#c084fc", glow: "rgba(192,132,252,0.4)", shadow: "rgba(192,132,252,0.18)" },
];

const defaultAchievements = [
  { _id:"1", title:"1st Rank — College Kaggle Competition",       rank:"1st Rank", event:"Annual Kaggle Data Science & ML Hackathon",        organization:"RGMCET", year:"2026", description:"Secured top place by engineering high-accuracy predictive models." },
  { _id:"2", title:"2nd Rank — College Web Development Event",    rank:"2nd Rank", event:"WebTech Hackathon & UI Engineering Challenge",      organization:"RGMCET", year:"2025", description:"Built an interactive high-performance web platform under strict time constraints." },
  { _id:"3", title:"2nd Rank — College Coding Contest",           rank:"2nd Rank", event:"Algorithmic Coding & Problem Solving Contest",      organization:"RGMCET", year:"2024", description:"Solved complex DS & Algo challenges within competitive speed benchmarks." },
];

const wrap = (i, n) => ((i % n) + n) % n;

const AchievementsSection = ({ achievements = [] }) => {
  const items   = achievements.length > 0 ? achievements : defaultAchievements;
  const total   = items.length;
  const [active, setActive]   = useState(0);
  const [hov, setHov]         = useState(null);
  const intervalRef           = useRef(null);

  const next = useCallback(() => setActive(c => wrap(c+1, total)), [total]);
  const prev = useCallback(() => setActive(c => wrap(c-1, total)), [total]);

  useEffect(() => {
    intervalRef.current = setInterval(next, 4000);
    return () => clearInterval(intervalRef.current);
  }, [next]);

  return (
    <section id="achievements" className="py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
      <div className="absolute top-1/4 left-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background:"rgba(250,204,21,0.06)" }} />
      <div className="absolute bottom-1/4 right-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background:"rgba(251,146,60,0.06)" }} />

      <div className="section-container relative z-10">
        {/* Header with Color-Sparked Card Pill & Space Grotesk */}
        <SectionHeader
          badgeText="07 // RECOGNITION & HONORS"
          icon={Trophy}
          color="#facc15"
          title="Achievements & "
          gradientTitle="Competition Ranks"
          description="Hackathons, algorithmic contests, and data science competitions."
        />

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-5">
          {items.map((item, idx) => {
            const c = palette[idx % palette.length];
            const isHov = hov === idx;
            return (
              <motion.div key={item._id||idx}
                initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.1}}
                transition={{duration:0.5,delay:idx*0.09,ease:easeCurve}}
                onMouseEnter={()=>setHov(idx)} onMouseLeave={()=>setHov(null)}
                className="relative rounded-2xl border overflow-hidden flex flex-col transition-all duration-300"
                style={{
                  background: isHov ? `linear-gradient(135deg,${c.hex}14,rgba(9,9,11,0.97))` : "rgba(9,9,11,0.85)",
                  borderColor: isHov ? c.hex : "rgba(63,63,70,0.65)",
                  boxShadow: isHov ? `0 10px 40px -8px ${c.shadow},0 0 0 1px ${c.hex}28` : "0 2px 10px rgba(0,0,0,0.3)",
                  transform: isHov ? "translateY(-3px)" : "translateY(0)",
                }}>
                {/* Accent bar */}
                <div className="h-0.5 w-full" style={{ background:`linear-gradient(90deg,${c.hex}${isHov?"ff":"66"},transparent 70%)` }} />
                {/* Uncropped Image / Certificate */}
                {(item.image||item.certificate) && (
                  <div className="overflow-hidden bg-[#07070a] border-b border-zinc-800/60 p-2 flex items-center justify-center" style={{height:"180px"}}>
                    <img src={resolveMediaUrl(item.image||item.certificate)} alt={item.title}
                      className="w-full h-full object-contain transition-transform duration-500"
                      style={{transform: isHov?"scale(1.03)":"scale(1)"}} />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center border"
                        style={{ background: `${c.hex}18`, borderColor: `${c.hex}45`, color: c.hex }}
                      >
                        <Trophy className="w-4 h-4" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border"
                        style={{background:`${c.hex}18`,color:c.hex,borderColor:`${c.hex}45`}}>
                        {item.rank}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md border" style={{background:`${c.hex}10`,color:`${c.hex}cc`,borderColor:`${c.hex}25`}}>{item.year}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white leading-snug">{item.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed flex-1">{item.description}</p>
                  <div className="pt-3 border-t text-[11px] font-mono" style={{borderColor:`${c.hex}20`,color:`${c.hex}bb`}}>
                    {item.event}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile carousel with side arrows */}
        <div className="block md:hidden">
          <div className="flex items-center gap-3">
            <button onClick={prev} className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95"
              style={{background:`${palette[active%palette.length].hex}15`,borderColor:`${palette[active%palette.length].hex}40`,color:palette[active%palette.length].hex}}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <AnimatePresence mode="wait">
              {(() => {
                const item = items[active];
                const c    = palette[active % palette.length];
                return (
                  <motion.div key={active}
                    initial={{opacity:0,y:16,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-16,scale:0.97}}
                    transition={{duration:0.28,ease:easeCurve}}
                    className="flex-1 rounded-2xl border overflow-hidden"
                    style={{background:`linear-gradient(145deg,${c.hex}14,rgba(9,9,11,0.97))`,borderColor:`${c.hex}50`,boxShadow:`0 10px 40px -8px ${c.shadow}`}}>
                    <div className="h-0.5" style={{background:`linear-gradient(90deg,${c.hex},${c.hex}22)`}} />
                    {(item.image||item.certificate) && (
                      <div className="overflow-hidden bg-[#07070a] border-b border-zinc-800/60 p-2 flex items-center justify-center" style={{height:"160px"}}>
                        <img src={resolveMediaUrl(item.image||item.certificate)} alt={item.title} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border"
                          style={{background:`${c.hex}18`,color:c.hex,borderColor:`${c.hex}45`}}>
                          <Trophy className="w-3 h-3" />{item.rank}
                        </span>
                        <span className="text-xs font-mono" style={{color:`${c.hex}88`}}>{item.year}</span>
                      </div>
                      <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                      <div className="pt-2 border-t text-[11px] font-mono" style={{borderColor:`${c.hex}20`,color:`${c.hex}88`}}>{item.event}</div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
            <button onClick={next} className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95"
              style={{background:`${palette[active%palette.length].hex}15`,borderColor:`${palette[active%palette.length].hex}40`,color:palette[active%palette.length].hex}}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {items.map((_,i) => {
              const c = palette[i%palette.length];
              return <button key={i} onClick={()=>setActive(i)} className="rounded-full transition-all duration-300"
                style={{width:i===active?"20px":"7px",height:"7px",background:i===active?c.hex:`${c.hex}35`,boxShadow:i===active?`0 0 8px ${c.glow}`:"none"}} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
