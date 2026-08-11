import React, { useState } from 'react';
import { Cpu, Code2, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import NlpEngineVisualizer from '../playground/NlpEngineVisualizer';
import AlgoStepVisualizer from '../playground/AlgoStepVisualizer';
import ApiBenchmarkVisualizer from '../playground/ApiBenchmarkVisualizer';

const tabs = [
  { id: 'ai-sim', label: '01 // NLP Engine', icon: Cpu },
  { id: 'algo', label: '02 // Algo Visualizer', icon: Code2 },
  { id: 'api', label: '03 // API Speed', icon: Zap },
];

const PlaygroundSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < tabs.length - 1 ? prev + 1 : prev));
  };

  return (
    <section id="experiments" className="py-20 relative w-full border-t border-slate-200 dark:border-zinc-800/60">
      <div className="section-container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-semibold">
              03 // INTERACTIVE LAB & EXPERIMENTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              Engineering Playground
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-600 dark:text-white/50 max-w-sm">
            Try lightweight live interactive demos of software algorithms, NLP parsing, and API benchmarking.
          </p>
        </div>

        {/* Navigation Controls Bar */}
        <div className="flex items-center justify-between gap-2 mb-8 border-b border-slate-200 dark:border-zinc-800 pb-3 overflow-x-auto">
          {/* Clickable Tab Buttons */}
          <div className="flex items-center gap-2">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeIndex === idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-indigo-600 text-white font-bold shadow-md scale-[1.02]' 
                      : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Previous / Next Slide Click Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous card"
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-white/70 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 disabled:opacity-30 disabled:hover:text-slate-700 disabled:hover:border-slate-200 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 px-1">
              {activeIndex + 1} / {tabs.length}
            </span>

            <button
              onClick={handleNext}
              disabled={activeIndex === tabs.length - 1}
              aria-label="Next card"
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-white/70 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 disabled:opacity-30 disabled:hover:text-slate-700 disabled:hover:border-slate-200 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sliding Card Container (Swipe Animation via Translate) */}
        <div className="w-full overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            <div className="w-full shrink-0">
              <NlpEngineVisualizer />
            </div>
            <div className="w-full shrink-0">
              <AlgoStepVisualizer />
            </div>
            <div className="w-full shrink-0">
              <ApiBenchmarkVisualizer />
            </div>
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-8 bg-indigo-600 dark:bg-indigo-400'
                  : 'w-2 bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PlaygroundSection;
