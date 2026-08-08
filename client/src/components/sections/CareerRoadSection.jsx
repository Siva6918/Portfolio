import React, { useState } from 'react';
import { GraduationCap, Cpu, Code2, FlaskConical, Briefcase, Rocket, Trophy, Target, Sparkles } from 'lucide-react';

const CareerRoadSection = () => {
  const [activeStep, setActiveStep] = useState(4);

  const roadNodes = [
    {
      id: 0,
      year: '2023',
      title: '🎓 EDUCATION',
      subtitle: 'Rajeev Gandhi Memorial College of Engineering & Tech',
      desc: 'B.Tech Computer Science & Engineering (8.1 CGPA). Core CS fundamentals & logic.',
      status: 'completed',
      color: '#6366f1',
      icon: GraduationCap
    },
    {
      id: 1,
      year: '2023 — 2024',
      title: '💻 PROGRAMMING',
      subtitle: 'Data Structures & Algorithms Engine',
      desc: 'Solved 300+ DSA problems (Arrays, DP, Graphs, Trees) with optimal time-space complexity.',
      status: 'completed',
      color: '#6366f1',
      icon: Cpu
    },
    {
      id: 2,
      year: '2024',
      title: '🧠 SKILLS & MERN STACK',
      subtitle: 'React 18, Node.js, Express, MongoDB & Redux',
      desc: 'Production full-stack web applications, REST APIs, state management, and modern UI.',
      status: 'completed',
      color: '#6366f1',
      icon: Code2
    },
    {
      id: 3,
      year: '2024 — 2025',
      title: '🏢 INTERNSHIPS',
      subtitle: 'Software Engineering Experience',
      desc: 'Practical full-stack development, cloud backend services, API rate limiting, and teamwork.',
      status: 'active',
      color: '#06b6d4',
      icon: Briefcase
    },
    {
      id: 4,
      year: '2025',
      title: '🧪 PROJECTS',
      subtitle: 'Project Laboratory Applications',
      desc: 'NutriCloud, DocSpot, Candidate Rank, and Weather App with full-stack production deployments.',
      status: 'active',
      color: '#06b6d4',
      icon: FlaskConical
    },
    {
      id: 5,
      year: '2025 — 2026',
      title: '🏆 CERTIFICATIONS',
      subtitle: 'Achievement Plaza & Industry Credentials',
      desc: 'Earning cloud & software engineering certifications while maintaining top academic performance.',
      status: 'completed',
      color: '#6366f1',
      icon: Trophy
    },
    {
      id: 6,
      year: '2026',
      title: '🚀 AI / CLOUD INTEGRATION',
      subtitle: 'FastAPI, OpenAI API, PyTorch & AWS Cloud Native',
      desc: 'AI-powered web tools, vector search pipelines, containerization (Docker), and cloud services.',
      status: 'future',
      color: '#3f3f46',
      icon: Rocket
    },
    {
      id: 7,
      year: '2027',
      title: '🎯 SOFTWARE ENGINEER',
      subtitle: 'Product-Based Tech Leaders (Target 2027)',
      desc: 'Graduating as a high-impact Software Engineer driving scalable web and AI product engineering.',
      status: 'future',
      color: '#3f3f46',
      icon: Target
    }
  ];

  return (
    <section id="career-road" className="py-20 relative w-full bg-transparent">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#2d2d3a] pb-6 mb-12 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#121217] border border-[#2d2d3a] flex items-center justify-center text-[#6366f1]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-[#6366f1]">
                DEVELOPER ROADMAP
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#fafafa]">
                CAREER ROAD SPINE
              </h3>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#fafafa]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]"></span>
              <span>Completed</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#06b6d4] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]"></span>
              <span>Active Node</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#a1a1aa]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]"></span>
              <span>Future</span>
            </span>
          </div>
        </div>

        {/* 3D Perspective Road Track */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Vertical Coherent SVG Spine Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-32 w-1.5 rounded-full bg-[#2d2d3a]">
            <div className="w-full bg-gradient-to-b from-[#6366f1] via-[#06b6d4] to-[#3f3f46] rounded-full h-[65%]"></div>
          </div>

          {/* Road Milestones */}
          <div className="space-y-12 relative z-10">
            {roadNodes.map((node, idx) => {
              const isEven = idx % 2 === 0;
              const IconComp = node.icon;
              const isCurrent = node.status === 'active';
              const isCompleted = node.status === 'completed';

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveStep(idx)}
                  className={`flex flex-col sm:flex-row items-center gap-6 cursor-pointer group ${
                    isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  
                  {/* Card Column */}
                  <div className="w-full sm:w-1/2">
                    <div
                      className={`glass-card p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${
                        activeStep === idx
                          ? 'border-[#06b6d4] shadow-[0_0_30px_rgba(6,182,212,0.25)] bg-[#121217]'
                          : isCompleted
                          ? 'border-[#6366f1]/40 hover:border-[#6366f1]'
                          : 'border-[#2d2d3a] hover:border-[#3f3f46]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-xs font-mono font-bold px-3 py-0.5 rounded-full border ${
                            isCurrent
                              ? 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/30'
                              : isCompleted
                              ? 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/30'
                              : 'bg-[#121217] text-[#a1a1aa] border-[#2d2d3a]'
                          }`}
                        >
                          {node.year}
                        </span>

                        {isCurrent && (
                          <span className="text-[10px] font-mono font-bold text-[#06b6d4] uppercase tracking-wider animate-pulse">
                            ● ACTIVE NODE
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-[#fafafa] group-hover:text-[#06b6d4] transition-colors">
                        {node.title}
                      </h4>

                      <p className="text-xs font-mono font-bold text-[#6366f1] mt-1">
                        {node.subtitle}
                      </p>

                      <p className="text-xs text-[#a1a1aa] leading-relaxed pt-2.5 border-t border-[#2d2d3a] mt-2.5">
                        {node.desc}
                      </p>
                    </div>
                  </div>

                  {/* Road Center Node Marker */}
                  <div className="shrink-0 relative z-20">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[#09090b] border-[#06b6d4] text-[#06b6d4] shadow-[0_0_20px_#06b6d4] scale-110'
                          : isCompleted
                          ? 'bg-[#09090b] border-[#6366f1] text-[#6366f1]'
                          : 'bg-[#09090b] border-[#3f3f46] text-[#a1a1aa]'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Spacer Column */}
                  <div className="hidden sm:block w-1/2"></div>

                </div>
              );
            })}
          </div>

          {/* 🎯 CAREER DESTINATION GATE */}
          <div className="mt-20 pt-8 text-center relative z-20">
            <div className="glass-card p-8 sm:p-12 rounded-3xl border-2 border-[#6366f1]/60 shadow-[0_0_50px_rgba(99,102,241,0.3)] max-w-xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#6366f1]/20 border border-[#6366f1] flex items-center justify-center text-[#fafafa] mx-auto">
                <Target className="w-7 h-7 text-[#6366f1]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-[#06b6d4] uppercase tracking-widest block">
                  CAREER DESTINATION GATE
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#fafafa]">
                  SOFTWARE ENGINEER
                </h3>
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#121217] border border-[#2d2d3a] text-xs font-mono font-bold text-[#10b981]">
                  TARGET GRADUATION 2027
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CareerRoadSection;
