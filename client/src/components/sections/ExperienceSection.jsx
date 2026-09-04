import React, { useState } from "react";
import { Briefcase, ExternalLink, Code2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../common/SectionHeader";
import { resolveMediaUrl } from "../../services/api";
import { useAnalytics } from "../../context/AnalyticsContext";

const easeCurve = [0.16, 1, 0.3, 1];

const expPalette = [
  { hex:"#f472b6", glow:"rgba(244,114,182,0.4)", shadow:"rgba(244,114,182,0.18)" },
  { hex:"#c084fc", glow:"rgba(192,132,252,0.4)", shadow:"rgba(192,132,252,0.18)" },
  { hex:"#38bdf8", glow:"rgba(56,189,248,0.4)",  shadow:"rgba(56,189,248,0.18)"  },
  { hex:"#fb923c", glow:"rgba(251,146,60,0.4)",  shadow:"rgba(251,146,60,0.18)"  },
];

const codePalette = [
  { hex:"#4ade80", glow:"rgba(74,222,128,0.4)",  shadow:"rgba(74,222,128,0.18)"  },
  { hex:"#facc15", glow:"rgba(250,204,21,0.4)",  shadow:"rgba(250,204,21,0.18)"  },
  { hex:"#38bdf8", glow:"rgba(56,189,248,0.4)",  shadow:"rgba(56,189,248,0.18)"  },
];

const defaultExp = [
  { _id:"1", role:"AWS AI-ML Virtual Intern", company:"AWS Academy / EduSkills", startDate:"2025", endDate:"2025", type:"Internship",
    description:"Worked with cloud architecture, EC2, S3, IAM security, and AWS SageMaker/AI services to deploy machine learning workflows.",
    technologies:["AWS S3","EC2","IAM","Python","Machine Learning"] },
  { _id:"2", role:"Full Stack Web Developer", company:"Academic & Open Source Projects", startDate:"2023", endDate:"Present", type:"Projects",
    description:"Built multiple production-grade MERN stack web applications featuring JWT auth, socket notifications, and NLP integrations.",
    technologies:["React","Node.js","Express","MongoDB","Redis","Tailwind CSS"] },
];

const defaultProfiles = [
  { platform:"LeetCode",    problemsSolved:"300+", rating:"1650",                  rank:"Top 25%", profileUrl:"https://leetcode.com/vasanreddy" },
  { platform:"HackerRank",  problemsSolved:"100+", rating:"5 Star Problem Solving", rank:"",       profileUrl:"https://hackerrank.com/vasanreddy" },
  { platform:"GeeksforGeeks",problemsSolved:"80+", rating:"CS Fundamentals",        rank:"",       profileUrl:"https://geeksforgeeks.org/user/vasanreddy" },
];

const wrap = (i,n) => ((i%n)+n)%n;

const ExperienceSection = ({ experience=[], codingProfiles=[] }) => {
  const { trackInteraction } = useAnalytics();
  const activeExp      = experience.length > 0 ? experience : defaultExp;
  const activeProfiles = codingProfiles.length > 0 ? codingProfiles : defaultProfiles;
  const [expandedId, setExpandedId] = useState(activeExp[0]?._id||"1");
  const [mobileExpIdx, setMobileExpIdx] = useState(0);
  const [mobileProfileIdx, setMobileProfileIdx] = useState(0);

  return (
    <section id="experience" className="py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
      <div className="absolute top-1/4 left-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{background:"rgba(244,114,182,0.06)"}} />
      <div className="absolute bottom-1/4 right-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{background:"rgba(192,132,252,0.06)"}} />

      <div className="section-container relative z-10">
        {/* Header with Color-Sparked Card Pill & Space Grotesk */}
        <SectionHeader
          badgeText="05 // EXPERIENCE & PROFILES"
          icon={Briefcase}
          color="#f472b6"
          title="Internships & "
          gradientTitle="Problem Solving"
          description="Practical engineering experience and competitive coding achievements."
        />

        {/* ══ MOBILE ══ */}
        <div className="block lg:hidden space-y-8">
          {/* Exp carousel */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3 text-pink-600 dark:text-pink-400">
              <Briefcase className="w-3.5 h-3.5" />ROLES & INTERNSHIPS
            </h3>
            <div className="flex items-center gap-3">
              <button onClick={()=>setMobileExpIdx(i=>wrap(i-1,activeExp.length))}
                className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center active:scale-95"
                style={{background:`${expPalette[mobileExpIdx%expPalette.length].hex}15`,borderColor:`${expPalette[mobileExpIdx%expPalette.length].hex}40`,color:expPalette[mobileExpIdx%expPalette.length].hex}}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <AnimatePresence mode="wait">
                {(() => {
                  const exp = activeExp[mobileExpIdx];
                  const c   = expPalette[mobileExpIdx%expPalette.length];
                  return (
                    <motion.div key={mobileExpIdx}
                      initial={{opacity:0,y:14,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-14,scale:0.97}}
                      transition={{duration:0.28,ease:easeCurve}}
                      className="flex-1 rounded-2xl border overflow-hidden"
                      style={{background:`linear-gradient(145deg,${c.hex}12,rgba(9,9,11,0.97))`,borderColor:`${c.hex}50`,boxShadow:`0 8px 32px -6px ${c.shadow}`}}>
                      <div className="h-0.5" style={{background:`linear-gradient(90deg,${c.hex},${c.hex}22)`}} />
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold" style={{color:c.hex}}>{exp.startDate} — {exp.endDate||"Present"}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border" style={{background:`${c.hex}14`,color:`${c.hex}cc`,borderColor:`${c.hex}35`}}>{exp.type||"Role"}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-white">{exp.role} <span className="text-zinc-500 font-normal">@ {exp.company}</span></h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">{exp.description}</p>
                        {exp.technologies && (
                          <div className="flex flex-wrap gap-1.5">
                            {exp.technologies.map(t=>(
                              <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-mono border" style={{background:`${c.hex}10`,color:`${c.hex}bb`,borderColor:`${c.hex}25`}}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
              <button onClick={()=>setMobileExpIdx(i=>wrap(i+1,activeExp.length))}
                className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center active:scale-95"
                style={{background:`${expPalette[mobileExpIdx%expPalette.length].hex}15`,borderColor:`${expPalette[mobileExpIdx%expPalette.length].hex}40`,color:expPalette[mobileExpIdx%expPalette.length].hex}}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Profiles carousel */}
          {activeProfiles.length >= 1 && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3 text-emerald-600 dark:text-emerald-400">
                <Code2 className="w-3.5 h-3.5" />CODING PROFILES
              </h3>
              <div className="flex items-center gap-3">
                <button onClick={()=>setMobileProfileIdx(i=>wrap(i-1,activeProfiles.length))}
                  className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center active:scale-95"
                  style={{background:`${codePalette[mobileProfileIdx%codePalette.length].hex}15`,borderColor:`${codePalette[mobileProfileIdx%codePalette.length].hex}40`,color:codePalette[mobileProfileIdx%codePalette.length].hex}}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <AnimatePresence mode="wait">
                  {(() => {
                    const p = activeProfiles[mobileProfileIdx];
                    const c = codePalette[mobileProfileIdx%codePalette.length];
                    return (
                      <motion.div key={mobileProfileIdx}
                        initial={{opacity:0,y:14,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-14,scale:0.97}}
                        transition={{duration:0.28,ease:easeCurve}}
                        className="flex-1 rounded-2xl border overflow-hidden"
                        style={{background:`linear-gradient(145deg,${c.hex}12,rgba(9,9,11,0.97))`,borderColor:`${c.hex}50`,boxShadow:`0 8px 32px -6px ${c.shadow}`}}>
                        <div className="h-0.5" style={{background:`linear-gradient(90deg,${c.hex},${c.hex}22)`}} />
                        <div className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {p.logo && <img src={resolveMediaUrl(p.logo)} alt={p.platform} className="w-8 h-8 rounded-lg object-contain border border-zinc-800 shrink-0" />}
                            <div>
                              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">{p.platform}
                                {p.profileUrl && <a href={p.profileUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" style={{color:c.hex}} /></a>}
                              </h4>
                              <p className="text-xs font-mono mt-1" style={{color:`${c.hex}99`}}>{p.problemsSolved} Problems · {p.rating}</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border" style={{background:`${c.hex}18`,color:c.hex,borderColor:`${c.hex}45`}}>Active</span>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
                <button onClick={()=>setMobileProfileIdx(i=>wrap(i+1,activeProfiles.length))}
                  className="shrink-0 w-10 h-10 rounded-full border flex items-center justify-center active:scale-95"
                  style={{background:`${codePalette[mobileProfileIdx%codePalette.length].hex}15`,borderColor:`${codePalette[mobileProfileIdx%codePalette.length].hex}40`,color:codePalette[mobileProfileIdx%codePalette.length].hex}}>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ══ DESKTOP ══ */}
        <div className="hidden lg:grid grid-cols-12 gap-8">
          {/* Experience */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2 text-pink-500 dark:text-pink-400">
              <Briefcase className="w-4 h-4" />INTERNSHIPS & ROLES
            </h3>
            {activeExp.map((exp,idx)=>{
              const c = expPalette[idx%expPalette.length];
              const isEx = expandedId===exp._id;
              return (
                <motion.div key={exp._id||exp.role}
                  initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.1}}
                  transition={{duration:0.5,delay:idx*0.1,ease:easeCurve}}
                  className="rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300"
                  style={{background:isEx?`linear-gradient(135deg,${c.hex}12,rgba(9,9,11,0.97))`:"rgba(9,9,11,0.85)",borderColor:isEx?c.hex:"rgba(63,63,70,0.65)",boxShadow:isEx?`0 8px 32px -6px ${c.shadow}`:"0 2px 10px rgba(0,0,0,0.3)"}}
                  onClick={()=>setExpandedId(isEx?null:exp._id)}>
                  <div className="h-0.5" style={{background:`linear-gradient(90deg,${c.hex}${isEx?"ff":"55"},transparent 65%)`}} />
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {exp.companyLogo && <img src={resolveMediaUrl(exp.companyLogo)} alt={exp.company} className="w-10 h-10 rounded-xl object-contain border border-zinc-800 shrink-0" />}
                      <div>
                        <span className="text-[11px] font-mono font-bold" style={{color:c.hex}}>{exp.startDate} — {exp.endDate||"Present"} · [{exp.type||"Role"}]</span>
                        <h4 className="text-base font-extrabold text-white mt-0.5">{exp.role} <span className="text-zinc-500 font-normal">@ {exp.company}</span></h4>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg transition-colors" style={{color:c.hex}}>
                      {isEx?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}
                    </button>
                  </div>
                  <AnimatePresence>
                    {isEx && (
                      <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:0.3,ease:easeCurve}} className="overflow-hidden">
                        <div className="px-5 pb-5 space-y-3 border-t" style={{borderColor:`${c.hex}20`}}>
                          <p className="text-xs text-zinc-400 leading-relaxed mt-3">{exp.description}</p>
                          {exp.technologies && (
                            <div className="flex flex-wrap gap-1.5">
                              {exp.technologies.map(t=>(
                                <span key={t} className="px-2.5 py-0.5 rounded-md text-[10px] font-mono border" style={{background:`${c.hex}10`,color:`${c.hex}bb`,borderColor:`${c.hex}25`}}>{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Coding Profiles */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2 text-emerald-500 dark:text-emerald-400">
              <Code2 className="w-4 h-4" />COMPETITIVE CODING PROFILES
            </h3>
            {activeProfiles.map((p,idx)=>{
              const c = codePalette[idx%codePalette.length];
              return (
                <motion.div key={p.platform}
                  initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.1}}
                  transition={{duration:0.5,delay:idx*0.1,ease:easeCurve}}
                  className="rounded-2xl border overflow-hidden transition-all duration-300 group flex flex-col"
                  style={{background:"rgba(9,9,11,0.88)",borderColor:"rgba(63,63,70,0.65)"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=c.hex;e.currentTarget.style.boxShadow=`0 10px 36px -6px ${c.shadow}`;e.currentTarget.style.transform="translateY(-2px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(63,63,70,0.65)";e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.3)";e.currentTarget.style.transform="none"}}>
                  <div className="h-0.5 w-full" style={{background:`linear-gradient(90deg,${c.hex},transparent 70%)`}} />
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border" style={{background:`${c.hex}14`,borderColor:`${c.hex}35`}}>
                        {p.logo ? <img src={resolveMediaUrl(p.logo)} alt={p.platform} className="w-6 h-6 object-contain" /> : <Code2 className="w-5 h-5" style={{color:c.hex}} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          {p.platform}
                          {p.profileUrl && (
                            <a href={p.profileUrl} target="_blank" rel="noreferrer" onClick={()=>trackInteraction("coding_profile_click",p.platform,"Experience",{url:p.profileUrl})}>
                              <ExternalLink className="w-3.5 h-3.5" style={{color:c.hex}} />
                            </a>
                          )}
                        </h4>
                        <p className="text-xs font-mono mt-1 text-zinc-400">{p.problemsSolved} Problems · {p.rating}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border" style={{background:`${c.hex}18`,color:c.hex,borderColor:`${c.hex}45`}}>Active</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
