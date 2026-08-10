import React, { useState } from 'react';
import { Cpu, Code2, Zap } from 'lucide-react';
import NlpEngineVisualizer from '../playground/NlpEngineVisualizer';
import AlgoStepVisualizer from '../playground/AlgoStepVisualizer';
import ApiBenchmarkVisualizer from '../playground/ApiBenchmarkVisualizer';

const PlaygroundSection = () => {
  const [activeTab, setActiveTab] = useState('ai-sim');

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

        {/* Lab Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-200 dark:border-zinc-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ai-sim')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all ${
              activeTab === 'ai-sim' 
                ? 'bg-indigo-600 text-white font-bold shadow-md' 
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>01 // NLP Match Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('algo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all ${
              activeTab === 'algo' 
                ? 'bg-indigo-600 text-white font-bold shadow-md' 
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>02 // Algo Step Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all ${
              activeTab === 'api' 
                ? 'bg-indigo-600 text-white font-bold shadow-md' 
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>03 // API Speed Benchmark</span>
          </button>
        </div>

        {/* Experiment Tab 1: AI / NLP Match Engine */}
        {activeTab === 'ai-sim' && (
          <NlpEngineVisualizer />
        )}

        {/* Experiment Tab 2: Algo Step Visualizer */}
        {activeTab === 'algo' && (
          <AlgoStepVisualizer />
        )}

        {/* Experiment Tab 3: API Speed Benchmark */}
        {activeTab === 'api' && (
          <ApiBenchmarkVisualizer />
        )}

      </div>
    </section>
  );
};

export default PlaygroundSection;
