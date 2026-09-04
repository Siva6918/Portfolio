import React, { useState } from "react";
import { Search, Sparkles, LayoutGrid, ListFilter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../common/SectionHeader";
import { resolveMediaUrl } from "../../services/api";

const easeCurve = [0.16, 1, 0.3, 1];

const catPalette = {
  "Programming Languages": { hex:"#fb923c", glow:"rgba(251,146,60,0.4)"  },
  "Frontend":               { hex:"#38bdf8", glow:"rgba(56,189,248,0.4)"  },
  "Backend":                { hex:"#4ade80", glow:"rgba(74,222,128,0.4)"  },
  "Databases":              { hex:"#facc15", glow:"rgba(250,204,21,0.4)"  },
  "Cloud & DevOps":         { hex:"#c084fc", glow:"rgba(192,132,252,0.4)" },
  "Core CS":                { hex:"#f472b6", glow:"rgba(244,114,182,0.4)" },
};

const defaultSkills = [
  { name:"Java",                    category:"Programming Languages", logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",                                              proficiency:"Advanced"     },
  { name:"JavaScript",              category:"Programming Languages", logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",                                  proficiency:"Advanced"     },
  { name:"Python",                  category:"Programming Languages", logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",                                          proficiency:"Intermediate" },
  { name:"C++",                     category:"Programming Languages", logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",                                    proficiency:"Intermediate" },
  { name:"React",                   category:"Frontend",              logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",                                            proficiency:"Advanced"     },
  { name:"Next.js",                 category:"Frontend",              logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",                                          proficiency:"Intermediate" },
  { name:"Tailwind CSS",            category:"Frontend",              logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",                                proficiency:"Advanced"     },
  { name:"Node.js",                 category:"Backend",               logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",                                          proficiency:"Advanced"     },
  { name:"Express.js",              category:"Backend",               logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",                                        proficiency:"Advanced"     },
  { name:"FastAPI",                 category:"Backend",               logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",                                        proficiency:"Intermediate" },
  { name:"MongoDB",                 category:"Databases",             logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",                                        proficiency:"Advanced"     },
  { name:"MySQL",                   category:"Databases",             logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",                                            proficiency:"Intermediate" },
  { name:"Redis",                   category:"Databases",             logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",                                            proficiency:"Intermediate" },
  { name:"AWS",                     category:"Cloud & DevOps",        logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",            proficiency:"Intermediate" },
  { name:"Docker",                  category:"Cloud & DevOps",        logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",                                          proficiency:"Intermediate" },
  { name:"Git & GitHub",            category:"Cloud & DevOps",        logo:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",                                                proficiency:"Advanced"     },
  { name:"Data Structures & Algorithms", category:"Core CS",         logo:"",                                                                                                                        proficiency:"Advanced"     },
  { name:"System Design",           category:"Core CS",               logo:"",                                                                                                                        proficiency:"Intermediate" },
];

const catNames = ["All","Programming Languages","Frontend","Backend","Databases","Cloud & DevOps","Core CS"];

const SkillsSection = ({ skills=[] }) => {
  const list = skills.length > 0 ? skills : defaultSkills;
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchTerm, setSearchTerm]   = useState("");
  const [viewMode, setViewMode]       = useState("compact");

  const filtered = list.filter(s => {
    const matchCat    = selectedCat === "All" || s.category === selectedCat;
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = catNames.filter(c=>c!=="All").map(cat=>({
    category: cat,
    items: list.filter(s => s.category===cat && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(g=>g.items.length>0);

  return (
    <section id="skills" className="py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
      <div className="absolute top-1/3 left-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{background:"rgba(251,146,60,0.05)"}} />
      <div className="absolute bottom-1/3 right-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{background:"rgba(56,189,248,0.05)"}} />

      <div className="section-container relative z-10">
        {/* Header with Color-Sparked Card Pill & Space Grotesk */}
        <SectionHeader
          badgeText="04 // STACK & COMPETENCIES"
          icon={Sparkles}
          color="#fb923c"
          title="Skills & "
          gradientTitle="Tech Stack"
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs">
              {[["compact","Sleek",ListFilter],["grid","Cards",LayoutGrid]].map(([mode,label,Icon])=>(
                <button key={mode} onClick={()=>setViewMode(mode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                  style={viewMode===mode?{background:"linear-gradient(135deg,#fb923c,#facc15)",color:"#000",fontWeight:"bold"}:{color:"rgba(161,161,170,0.7)"}}>
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input type="text" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Filter skill..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-orange-500/60 transition-colors" />
            </div>
          </div>
        </SectionHeader>

        {/* Compact grouped view */}
        {viewMode==="compact" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {grouped.map(group => {
              const c = catPalette[group.category] || {hex:"#fb923c",glow:"rgba(251,146,60,0.4)"};
              return (
                <motion.div key={group.category}
                  initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.1}}
                  transition={{duration:0.4,ease:easeCurve}}
                  className="rounded-2xl border overflow-hidden transition-all duration-300"
                  style={{background:"rgba(9,9,11,0.85)",borderColor:"rgba(63,63,70,0.65)"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=c.hex;e.currentTarget.style.boxShadow=`0 8px 32px -6px ${c.glow.replace("0.4","0.18")}`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(63,63,70,0.65)";e.currentTarget.style.boxShadow="none";}}>
                  <div className="h-0.5" style={{background:`linear-gradient(90deg,${c.hex},${c.hex}22)`}} />
                  <div className="p-5 space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b" style={{borderColor:`${c.hex}20`}}>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{color:c.hex}}>{group.category}</h3>
                      <span className="text-[10px] font-mono text-zinc-600">{group.items.length} skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map(skill=>(
                        <div key={skill.name}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200"
                          style={{background:`${c.hex}0e`,borderColor:`${c.hex}28`,color:"rgba(228,228,231,0.9)"}}>
                          {skill.logo ? (
                            <img src={resolveMediaUrl(skill.logo)} alt={skill.name} className="w-4 h-4 object-contain" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" style={{color:c.hex}} />
                          )}
                          {skill.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Grid view */}
        {viewMode==="grid" && (
          <div>
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
              {catNames.map(cat=>{
                const c = cat==="All"?{hex:"#fb923c"}:(catPalette[cat]||{hex:"#fb923c"});
                return (
                  <button key={cat} onClick={()=>setSelectedCat(cat)}
                    className="px-3.5 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border"
                    style={selectedCat===cat?{background:`linear-gradient(135deg,${c.hex},${c.hex}cc)`,color:"#000",fontWeight:"bold",borderColor:c.hex}:{background:"rgba(9,9,11,0.8)",borderColor:"rgba(63,63,70,0.5)",color:"rgba(161,161,170,0.8)"}}>
                    {cat}
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {filtered.map((skill,idx)=>{
                const c = catPalette[skill.category]||{hex:"#fb923c"};
                return (
                  <motion.div key={skill._id||skill.name||idx}
                    initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.3,delay:idx*0.03,ease:easeCurve}}
                    className="rounded-xl border overflow-hidden flex flex-col transition-all duration-300 group"
                    style={{background:"rgba(9,9,11,0.88)",borderColor:"rgba(63,63,70,0.65)"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=c.hex;e.currentTarget.style.boxShadow=`0 8px 24px -4px ${c.hex}30`;e.currentTarget.style.transform="translateY(-2px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(63,63,70,0.65)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
                    <div className="h-0.5 w-full" style={{background:`linear-gradient(90deg,${c.hex},transparent 70%)`}} />
                    <div className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border" style={{background:`${c.hex}16`,borderColor:`${c.hex}40`}}>
                          {skill.logo ? <img src={resolveMediaUrl(skill.logo)} alt={skill.name} className="w-5 h-5 object-contain" /> : <Sparkles className="w-4 h-4" style={{color:c.hex}} />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{skill.name}</h4>
                          <span className="text-[9px] font-mono text-zinc-500">{skill.category}</span>
                        </div>
                      </div>
                      {skill.proficiency && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border" style={{background:`${c.hex}14`,color:c.hex,borderColor:`${c.hex}35`}}>{skill.proficiency}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
