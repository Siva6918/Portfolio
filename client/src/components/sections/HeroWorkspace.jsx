import React, { useState } from 'react';
import { Terminal, Laptop, BookOpen, Cpu, Sparkles, ExternalLink, Code2, User } from 'lucide-react';
import { useMode } from '../../context/ModeContext';
import { useAnalytics } from '../../context/AnalyticsContext';

const HeroWorkspace = ({ profile }) => {
  const { isPlayMode } = useMode();
  const { trackInteraction } = useAnalytics();
  const [activeItem, setActiveItem] = useState(null);

  const workspaceItems = [
    {
      id: 'laptop',
      title: 'Full Stack Engineering',
      icon: Laptop,
      color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
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
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
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
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300',
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
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
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
      <div className="relative w-full editorial-card p-6 sm:p-8 overflow-hidden">
        
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
              <span className="flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
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
                className={`group cursor-pointer p-5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'border-indigo-500/60 bg-indigo-500/10 shadow-lg'
                    : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100 dark:border-zinc-800 dark:bg-[#181820] dark:hover:border-zinc-700 dark:hover:bg-[#20202a]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg border ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-white/50 tracking-wider">
                    [{item.tag}]
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                  <span>{item.title}</span>
                  <Code2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                </h4>

                <p className="text-xs text-slate-600 dark:text-white/70 mt-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Identity Footer Badge */}
        <div className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#181820] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-700 dark:text-white/80">
              <User className="w-4 h-4" />
            </div>
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
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">[{activeItem.tag}]</span>
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
