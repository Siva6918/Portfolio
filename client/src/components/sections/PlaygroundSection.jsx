import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Sparkles, Zap, BarChart2, Code2, Cpu, 
  ChevronLeft, ChevronRight, Terminal, Trophy
} from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

import SnakeGame from '../playground/SnakeGame';
import MemoryGame from '../playground/MemoryGame';
import SpeedTyperGame from '../playground/SpeedTyperGame';
import SortingVisualizer from '../playground/SortingVisualizer';
import AlgoStepVisualizer from '../playground/AlgoStepVisualizer';
import NlpEngineVisualizer from '../playground/NlpEngineVisualizer';
import ApiBenchmarkVisualizer from '../playground/ApiBenchmarkVisualizer';
import GlassmorphismGenerator from '../playground/GlassmorphismGenerator';

const gamesList = [
  {
    id: 'snake',
    name: 'Retro Snake 2088',
    shortLabel: '01 // Snake Game',
    category: 'ARCADE CLUTCH',
    color: '#f43f5e',
    icon: Gamepad2,
    description: 'Classic cyberpunk snake on a glowing neon grid. Grow the snake, collect cyber-orbs, and set a new high score.',
    component: SnakeGame,
  },
  {
    id: 'memory',
    name: 'Tech Matrix Match',
    shortLabel: '02 // Memory Matrix',
    category: 'BRAIN CHALLENGE',
    color: '#f59e0b',
    icon: Sparkles,
    description: 'Test your memory recall by matching pairs of developer ecosystem stacks (React, Node, Python, Docker, etc.).',
    component: MemoryGame,
  },
  {
    id: 'typer',
    name: 'Speed Code Typer',
    shortLabel: '03 // Code Typer',
    category: 'HIGH APM TEST',
    color: '#e2e8f0',
    icon: Zap,
    description: 'Rapid 30-second developer typing challenge. Type production code snippets with live WPM and accuracy metrics.',
    component: SpeedTyperGame,
  },
  {
    id: 'sort',
    name: 'Sort Algorithm Visualizer',
    shortLabel: '04 // Sort Race',
    category: 'ALGORITHM RACE',
    color: '#fbbf24',
    icon: BarChart2,
    description: 'Live interactive Bubble Sort race with real-time bar height transitions, variable speed, and array randomization.',
    component: SortingVisualizer,
  },
  {
    id: 'algo',
    name: 'Algo Step-by-Step Visualizer',
    shortLabel: '05 // Algo Steps',
    category: 'DATA STRUCTURES',
    color: '#fb7185',
    icon: Code2,
    description: 'Deep dive into Binary Search, Dijkstra shortest path, BFS graphs, Dynamic Programming, and Stack evaluators.',
    component: AlgoStepVisualizer,
  },
  {
    id: 'nlp',
    name: 'NLP Token & Sentiment Engine',
    shortLabel: '06 // NLP Engine',
    category: 'AI SIMULATOR',
    color: '#f59e0b',
    icon: Cpu,
    description: 'Natural language pipeline simulation: test sentence tokenization, entity extraction, and sentiment polarity.',
    component: NlpEngineVisualizer,
  },
  {
    id: 'api',
    name: 'API Speed & Latency Benchmark',
    shortLabel: '07 // API Speed',
    category: 'TACTICAL LAB',
    color: '#f43f5e',
    icon: Zap,
    description: 'Simulate REST and WebSocket microservice latency, payload serialization overhead, and network throughput.',
    component: ApiBenchmarkVisualizer,
  },
  {
    id: 'glass',
    name: 'Glassmorphism UI Studio',
    shortLabel: '08 // Glass UI',
    category: 'DESIGN STUDIO',
    color: '#e2e8f0',
    icon: Cpu,
    description: 'Interactive CSS backdrop filter and glassmorphism generator with live sliders and instant CSS copy.',
    component: GlassmorphismGenerator,
  },
];

const PlaygroundSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const currentGame = gamesList[activeIndex];
  const CurrentComponent = currentGame.component;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : gamesList.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < gamesList.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation between games (if not actively typing in an input)
  useEffect(() => {
    const handleKeyNav = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'ArrowRight' && e.altKey) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, []);

  return (
    <section id="playground" className="py-16 md:py-24 relative w-full border-t border-editorial-border overflow-hidden">
      <div className="section-container pt-4">
        
        {/* Header */}
        <SectionHeader
          badgeText="INTERACTIVE ARCADE // EXPERIMENTS"
          icon={Gamepad2}
          color={currentGame.color}
          title="Developer "
          gradientTitle="Playground & Games"
          description="Interactive mini-games, algorithmic visualizers, and experimental micro-tools displayed one by one."
        />

        {/* Game Navigation Selector Tray */}
        <div className="w-full flex items-center justify-between gap-3 mb-6 pb-3 border-b border-editorial-border overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            {gamesList.map((game, idx) => {
              const Icon = game.icon;
              const isActive = activeIndex === idx;
              return (
                <button
                  key={game.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs transition-all whitespace-nowrap border shrink-0 ${
                    isActive
                      ? 'font-bold text-white shadow-lg'
                      : 'border-zinc-800 bg-[#0e0e13] text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                  style={isActive ? {
                    background: `linear-gradient(135deg, ${game.color}cc, #181824)`,
                    borderColor: game.color,
                    boxShadow: `0 4px 20px ${game.color}35`,
                    transform: 'translateY(-1px)'
                  } : {}}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isActive ? '#fff' : game.color }} />
                  <span>{game.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Prev / Next Game Header Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous Game"
              className="p-2 rounded-xl border border-zinc-800 bg-[#0e0e13] text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 flex items-center gap-1 font-mono text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">PREV</span>
            </button>

            <span className="text-xs font-mono text-zinc-400 px-2 font-bold whitespace-nowrap">
              {activeIndex + 1} / {gamesList.length}
            </span>

            <button
              onClick={handleNext}
              aria-label="Next Game"
              className="p-2 rounded-xl border border-zinc-800 bg-[#0e0e13] text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 flex items-center gap-1 font-mono text-xs"
            >
              <span className="hidden sm:inline">NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Game Stage Showcase - DISPLAYED ONE BY ONE */}
        <div className="w-full rounded-2xl border border-editorial-border bg-[#0d0d12]/95 shadow-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden transition-all duration-300">
          
          {/* Top Game Stage Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border"
                  style={{ 
                    color: currentGame.color, 
                    borderColor: `${currentGame.color}50`, 
                    background: `${currentGame.color}15` 
                  }}
                >
                  {currentGame.category}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  GAME {activeIndex + 1} OF {gamesList.length}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-grotesk text-white flex items-center gap-2.5">
                <currentGame.icon className="w-6 h-6" style={{ color: currentGame.color }} />
                <span>{currentGame.name}</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1 max-w-2xl leading-relaxed">
                {currentGame.description}
              </p>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl border border-zinc-800 bg-[#121218] hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREVIOUS GAME</span>
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl font-mono text-xs font-bold text-black flex items-center gap-1.5 shadow-lg shadow-marigold/20 transition-all active:scale-95 bg-gradient-to-r from-marigold to-neonRose"
              >
                <span>NEXT GAME</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dedicated Individual Game Mount */}
          <div key={currentGame.id} className="w-full animate-fade-in">
            <CurrentComponent isActive={true} />
          </div>

          {/* Bottom Pagination Dots & Next Game Teaser */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-zinc-800/80">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {gamesList.map((g, idx) => (
                <button
                  key={g.id}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Jump to ${g.name}`}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: activeIndex === idx ? '2.5rem' : '0.5rem',
                    background: activeIndex === idx ? currentGame.color : 'rgba(255,255,255,0.15)'
                  }}
                />
              ))}
            </div>

            {/* Next Game Teaser */}
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <span>Next up:</span>
              <button
                onClick={handleNext}
                className="hover:underline font-bold text-zinc-200"
                style={{ color: gamesList[(activeIndex + 1) % gamesList.length].color }}
              >
                {gamesList[(activeIndex + 1) % gamesList.length].name} →
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PlaygroundSection;
