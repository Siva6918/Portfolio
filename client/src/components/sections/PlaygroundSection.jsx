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
    <section id="experiments" className="py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
      <div className="section-container">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-xs font-mono tracking-widest text-rose-600 dark:text-rose-400 uppercase font-semibold mb-2">
              03 // INTERACTIVE LAB & EXPERIMENTS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">Engineering{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400">Playground</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-400 max-w-sm">
            Try lightweight live interactive demos of software algorithms, NLP parsing, and API benchmarking.
          </p>
        </div>

        {/* Navigation Controls Bar */}
        <div className="flex items-center justify-between gap-2 mb-8 border-b pb-3 overflow-x-auto" style={{borderColor:"rgba(63,63,70,0.5)"}}>
          {/* Clickable Tab Buttons */}
          <div className="flex items-center gap-2">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeIndex === idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveIndex(idx)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all whitespace-nowrap border"
                  style={isActive
                    ? { background: 'linear-gradient(135deg,#fb7185,#c084fc)', color: '#fff', fontWeight: 'bold', borderColor: 'transparent', boxShadow: '0 4px 16px rgba(251,113,133,0.3)', transform: 'scale(1.02)' }
                    : { background: 'rgba(9,9,11,0.8)', borderColor: 'rgba(63,63,70,0.6)', color: 'rgba(161,161,170,0.8)' }
                  }
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
              className="p-2 rounded-xl border text-zinc-400 hover:text-white disabled:opacity-30 transition-all" style={{background:"rgba(9,9,11,0.8)",borderColor:"rgba(63,63,70,0.6)"}}
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
              className="p-2 rounded-xl border text-zinc-400 hover:text-white disabled:opacity-30 transition-all" style={{background:"rgba(9,9,11,0.8)",borderColor:"rgba(63,63,70,0.6)"}}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sliding Card Container (Swipe Animation via Translate) */}
        <div className="w-full overflow-hidden rounded-2xl">
          <div 
            className="flex items-stretch transition-transform duration-500 ease-in-out w-full"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            <div className="w-full shrink-0 flex flex-col">
              <NlpEngineVisualizer isActive={activeIndex === 0} className="h-full" />
            </div>
            <div className="w-full shrink-0 flex flex-col">
              <AlgoStepVisualizer className="h-full" />
            </div>
            <div className="w-full shrink-0 flex flex-col">
              <ApiBenchmarkVisualizer className="h-full" />
            </div>
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveIndex(idx)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={activeIndex === idx
                ? { width: '2rem', background: 'linear-gradient(90deg,#fb7185,#c084fc)' }
                : { width: '0.5rem', background: 'rgba(63,63,70,0.7)' }
              }
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PlaygroundSection;


