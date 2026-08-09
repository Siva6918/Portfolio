import React from 'react';
import { GraduationCap, Cpu, Code2, FlaskConical, Briefcase, Rocket, Trophy, Target, Sparkles } from 'lucide-react';

const iconMap = {
  GraduationCap, Cpu, Code2, FlaskConical, Briefcase, Rocket, Trophy, Target, Sparkles
};

const defaultNodes = [
  {
    id: 0, year: '2023', title: 'Education',
    subtitle: 'B.Tech CSE — RGMCET',
    desc: 'Core CS fundamentals, 8.1 CGPA.',
    status: 'completed', icon: GraduationCap
  },
  {
    id: 1, year: '2023–24', title: 'DSA & Programming',
    subtitle: '300+ Problems Solved',
    desc: 'Arrays, DP, Graphs, Trees — optimal time-space complexity.',
    status: 'completed', icon: Cpu
  },
  {
    id: 2, year: '2024', title: 'MERN Stack',
    subtitle: 'React, Node.js, Express, MongoDB',
    desc: 'Production full-stack web applications & REST APIs.',
    status: 'completed', icon: Code2
  },
  {
    id: 3, year: '2024–25', title: 'Internships',
    subtitle: 'Software Engineering Experience',
    desc: 'Full-stack development, cloud backends, API design.',
    status: 'active', icon: Briefcase
  },
  {
    id: 4, year: '2025', title: 'Projects',
    subtitle: 'Production Deployments',
    desc: 'NutriCloud, DocSpot, Candidate Rank — full-stack apps.',
    status: 'active', icon: FlaskConical
  },
  {
    id: 5, year: '2025–26', title: 'Certifications',
    subtitle: 'Industry Credentials',
    desc: 'Cloud & software engineering certifications.',
    status: 'completed', icon: Trophy
  },
  {
    id: 6, year: '2026', title: 'AI & Cloud',
    subtitle: 'FastAPI, OpenAI, AWS',
    desc: 'AI-powered tools, containerization, cloud services.',
    status: 'future', icon: Rocket
  },
  {
    id: 7, year: '2027', title: 'Software Engineer',
    subtitle: 'Target: Product-Based Company',
    desc: 'Scalable web & AI product engineering.',
    status: 'future', icon: Target
  }
];

const statusColorMap = { completed: '#6366f1', active: '#06b6d4', future: '#27272a' };

const CareerRoadSection = ({ careerNodes = [] }) => {
  const roadNodes = careerNodes.length > 0
    ? careerNodes.map((node, idx) => ({
        id: node._id || idx,
        year: node.year,
        title: node.title,
        subtitle: node.subtitle,
        desc: node.description,
        status: node.status || 'future',
        color: statusColorMap[node.status] || '#27272a',
        icon: iconMap[node.icon] || Target
      }))
    : defaultNodes.map(n => ({ ...n, color: statusColorMap[n.status] }));

  return (
    <section id="career-road" className="py-16 relative w-full">
      <div className="section-container">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1]">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-xs uppercase font-mono font-semibold tracking-widest text-[#a5b4fc]">
                Developer Roadmap
              </h2>
              <h3 className="text-2xl font-bold text-[#fafafa]">
                Career Timeline
              </h3>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-mono text-[#71717a]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6366f1]"></span>
              Done
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#06b6d4]"></span>
              Active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#27272a]"></span>
              Upcoming
            </span>
          </div>
        </div>

        {/* Vertical Timeline — Single Column */}
        <div className="relative max-w-2xl mx-auto">
          
          {/* Timeline Line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[#27272a]" />

          <div className="space-y-6">
            {roadNodes.map((node) => {
              const IconComp = node.icon;
              const isActive = node.status === 'active';
              const isCompleted = node.status === 'completed';
              const isFuture = node.status === 'future';

              return (
                <div key={node.id} className="relative flex items-start gap-5 pl-0">
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                        isActive
                          ? 'bg-[#06b6d4]/10 border-[#06b6d4]/40 text-[#06b6d4]'
                          : isCompleted
                          ? 'bg-[#6366f1]/10 border-[#6366f1]/30 text-[#6366f1]'
                          : 'bg-[#18181b] border-[#27272a] text-[#52525b]'
                      }`}
                    >
                      <IconComp className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-1 ${isFuture ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-mono font-semibold ${
                        isActive ? 'text-[#06b6d4]' : isCompleted ? 'text-[#a5b4fc]' : 'text-[#52525b]'
                      }`}>
                        {node.year}
                      </span>
                      {isActive && (
                        <span className="text-[9px] font-mono font-bold text-[#06b6d4] uppercase tracking-wider animate-pulse">
                          • Current
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[#fafafa]">{node.title}</h4>
                    <p className="text-xs text-[#a5b4fc] font-medium mt-0.5">{node.subtitle}</p>
                    <p className="text-xs text-[#71717a] mt-1 leading-relaxed">{node.desc}</p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CareerRoadSection;
