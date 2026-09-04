import React, { useState } from 'react';
import { Terminal, Laptop, BookOpen, Cpu, Sparkles, ExternalLink, Code2, User } from 'lucide-react';
import { useMode } from '../../context/ModeContext';
import { useAnalytics } from '../../context/AnalyticsContext';
import { useProfileModal } from '../../context/ProfileModalContext';
import { resolveMediaUrl } from '../../services/api';

const HeroWorkspace = ({ profile }) => {
  const { isPlayMode } = useMode();
  const { trackInteraction } = useAnalytics();
  const { openProfile } = useProfileModal();
  const [activeItem, setActiveItem] = useState(null);

  const workspaceItems = [
    {
      id: 'laptop',
      title: 'Full Stack Engineering',
      icon: Laptop,
      hex: '#38bdf8',
      glow: 'rgba(56,189,248,0.3)',
      tag: 'PROJECTS',
      summary: 'MERN stack applications with clean architecture and real-time features.',
      details: 'Built NutriCloud Monitor, DocSpot, Candidate Rank System, and Weather apps with Node.js, React, and MongoDB.',
      actionText: 'Explore Projects →',
      actionTarget: '#projects'
    },
    {
      id: 'terminal',
      title: 'Developer Terminal & Stack',
      icon: Terminal,
      hex: '#4ade80',
      glow: 'rgba(74,222,128,0.3)',
      tag: 'GITHUB & TECH',
      summary: 'Java, JavaScript, Python, C++, React, Node.js, Express, MongoDB, Docker.',
      details: 'Active LeetCode solver (300+ problems), HackerRank 5-Star in Problem Solving.',
      actionText: 'View GitHub Profile →',
      actionUrl: profile?.github || 'https://github.com/vasanreddy'
    },
    {
      id: 'notebook',
      title: 'Learning Notebook',
      icon: BookOpen,
      hex: '#facc15',
      glow: 'rgba(250,204,21,0.3)',
      tag: '2026 FOCUS',
      summary: 'Data Structures & Algorithms, System Design, Cloud Architecture & RAG Pipelines.',
      details: 'Focusing on production performance, scalable API structures, and optimal algorithmic complexity.',
      actionText: 'View Skills →',
      actionTarget: '#skills'
    },
    {
      id: 'ai-card',
      title: 'AI & ML Integrations',
      icon: Cpu,
      hex: '#c084fc',
      glow: 'rgba(192,132,252,0.3)',
      tag: 'EXPERIMENTS',
      summary: 'FastAPI, spaCy NLP, RAG Pipelines, and anomaly scoring algorithms.',
      details: 'Built automated candidate rank parsing via spaCy NLP and real-time security threat scoring.',
      actionText: 'Try Interactive Lab →',
      actionTarget: '#experiments'
    }
  ];

  const handleAction = (item) => {
    if (item.actionUrl) {
      trackInteraction('github_click', 'Workspace Terminal GitHub', 'Hero', { url: item.actionUrl });
      window.open(item.actionUrl, '_blank', 'noopener,noreferrer');
    } else if (item.actionTarget) {
      trackInteraction('workspace_nav_click', item.title, 'Hero', { target: item.actionTarget });
      const target = document.querySelector(item.actionTarget);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setActiveItem(null);
  };

  return (
    <div className="relative w-full">
      {/* Workspace Container */}
      <div className="relative w-full rounded-2xl border border-slate-200 dark:border-zinc-800/80 bg-white/90 dark:bg-[#09090c] p-6 sm:p-8 overflow-hidden shadow-2xl">
        
        {/* Workspace Title & Window Dots */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-xs text-slate-500 dark:text-white/50">siva@workspace:~</span>
          </div>

          <div className="flex items-center gap-2">
            {isPlayMode && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                <Sparkles className="w-3 h-3" /> CLICK OBJECTS TO EXPLORE
              </span>
            )}
            <span className="text-[11px] font-mono text-slate-500 dark:text-white/50">Interactive Workspace</span>
          </div>
        </div>

        {/* 2D Interactive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workspaceItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeItem?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group cursor-pointer rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                style={{
                  background: isSelected ? `linear-gradient(135deg, ${item.hex}18, rgba(9,9,11,0.96))` : "rgba(9,9,11,0.88)",
                  borderColor: isSelected ? item.hex : "rgba(63,63,70,0.65)",
                  boxShadow: isSelected ? `0 10px 36px -6px ${item.glow}` : "0 2px 10px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = item.hex;
                  e.currentTarget.style.boxShadow = `0 10px 36px -6px ${item.glow}`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "rgba(63,63,70,0.65)";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
                  }
                  e.currentTarget.style.transform = "none";
                }}
              >
                {/* Top accent line */}
                <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${item.hex}, transparent 70%)` }} />

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all"
                      style={{ background: `${item.hex}18`, borderColor: `${item.hex}40`, boxShadow: `0 0 14px ${item.glow}` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.hex }} />
                    </div>
                    <span
                      className="text-[10px] font-mono tracking-wider font-bold px-2.5 py-0.5 rounded-full border"
                      style={{ background: `${item.hex}14`, color: item.hex, borderColor: `${item.hex}35` }}
                    >
                      [{item.tag}]
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center justify-between">
                      <span>{item.title}</span>
                      <Code2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: item.hex }} />
                    </h4>

                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Identity Footer Badge */}
        <div className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#181820] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openProfile(resolveMediaUrl(profile?.profileImage) || '/Avatar.png')}
              className="relative w-9 h-9 rounded-lg overflow-hidden border border-emerald-500/40 hover:border-emerald-400 hover:scale-110 active:scale-95 transition-all duration-200 shrink-0 cursor-pointer shadow-sm"
              title="Click to view full profile photo"
            >
              <img
                src={resolveMediaUrl(profile?.profileImage) || '/Avatar.png'}
                alt="Siva Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/Avatar.png'; }}
              />
            </button>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Rajeev Gandhi Memorial College (RGMCET)</p>
              <p className="text-[11px] font-mono text-slate-600 dark:text-white/50">B.Tech Computer Science & Engineering (2023 - 2027) · CGPA 8.1</p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-md text-[10px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Open for Internships
          </span>
        </div>

      </div>

      {/* Interactive Item Modal */}
      {activeItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveItem(null)}
        >
          <div 
            className="editorial-card-elevated p-6 sm:p-8 max-w-lg w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-sky-500 dark:text-sky-400">[{activeItem.tag}]</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeItem.title}</h3>
              </div>
              <button 
                onClick={() => setActiveItem(null)}
                className="text-xs font-mono text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
              >
                [ESC]
              </button>
            </div>

            <p className="text-sm text-slate-700 dark:text-white/80 leading-relaxed">
              {activeItem.details}
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveItem(null)}
                className="px-4 py-2 rounded-lg text-xs font-mono text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => handleAction(activeItem)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-lg transition-all"
              >
                <span>{activeItem.actionText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroWorkspace;

