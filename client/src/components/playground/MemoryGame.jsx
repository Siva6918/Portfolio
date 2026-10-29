import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Timer, Sparkles, CheckCircle2 } from 'lucide-react';

const TECH_CARDS = [
  { id: 'react', name: 'React', icon: '⚛️', color: '#38bdf8' },
  { id: 'node', name: 'Node.js', icon: '🟢', color: '#4ade80' },
  { id: 'python', name: 'Python', icon: '🐍', color: '#facc15' },
  { id: 'docker', name: 'Docker', icon: '🐳', color: '#60a5fa' },
  { id: 'mongo', name: 'MongoDB', icon: '🍃', color: '#34d399' },
  { id: 'ts', name: 'TypeScript', icon: '🔷', color: '#3b82f6' },
  { id: 'aws', name: 'AWS Cloud', icon: '☁️', color: '#fb923c' },
  { id: 'git', name: 'Git Repo', icon: '🐙', color: '#f43f5e' },
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initGame = () => {
    const deck = [...TECH_CARDS, ...TECH_CARDS].map((item, idx) => ({
      uniqueId: `${item.id}-${idx}`,
      techId: item.id,
      name: item.name,
      icon: item.icon,
      color: item.color
    }));
    setCards(shuffle(deck));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setTimerRunning(false);
    setGameWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let interval = null;
    if (timerRunning && !gameWon) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, gameWon]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].techId)) {
      return;
    }

    if (!timerRunning) setTimerRunning(true);

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].techId === cards[secondIdx].techId) {
        const newMatched = [...matched, cards[firstIdx].techId];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === TECH_CARDS.length) {
          setGameWon(true);
          setTimerRunning(false);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 900);
      }
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-[#0a0a0f]/90 p-5 md:p-8 flex flex-col items-center">
      {/* Header Info */}
      <div className="w-full max-w-lg flex items-center justify-between gap-4 mb-6 pb-3 border-b border-zinc-800/80 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-zinc-400">MOVES:</span>
          <span className="text-white font-bold">{moves}</span>
        </div>

        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-amber-400" />
          <span className="text-zinc-400">TIME:</span>
          <span className="text-amber-400 font-bold">{formatTime(seconds)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400">PAIRS:</span>
          <span className="text-emerald-400 font-bold">{matched.length} / {TECH_CARDS.length}</span>
        </div>

        <button
          onClick={initGame}
          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
          title="Restart Game"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Grid: 4x4 */}
      <div className="relative w-full max-w-lg grid grid-cols-4 gap-3 sm:gap-4 aspect-square">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(card.techId);
          const isMatched = matched.includes(card.techId);

          return (
            <button
              key={card.uniqueId}
              onClick={() => handleCardClick(idx)}
              disabled={isMatched}
              className={`relative rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer select-none perspective-500 ${
                isMatched
                  ? 'border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : isFlipped
                  ? 'border-purple-500/60 bg-[#161622] shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                  : 'border-zinc-800 bg-[#111118] hover:border-zinc-600 hover:bg-[#151520]'
              }`}
              style={{
                transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(0deg)',
              }}
            >
              {isFlipped ? (
                <div className="flex flex-col items-center justify-center p-2 text-center animate-scale-in">
                  <span className="text-2xl sm:text-3xl mb-1">{card.icon}</span>
                  <span 
                    className="font-mono text-[9px] sm:text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: card.color }}
                  >
                    {card.name}
                  </span>
                  {isMatched && (
                    <span className="text-[8px] font-mono text-emerald-400 uppercase mt-0.5">MATCH</span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-600 font-mono text-xs">
                  <span className="text-xl sm:text-2xl opacity-40">❖</span>
                  <span className="text-[9px] font-bold mt-1 text-zinc-500">{(idx + 1).toString().padStart(2, '0')}</span>
                </div>
              )}
            </button>
          );
        })}

        {/* Win Overlay */}
        {gameWon && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20 animate-fade-in border border-emerald-500/40">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 animate-bounce" />
            <h4 className="text-2xl sm:text-3xl font-bold font-grotesk text-white mb-2">MATRIX CLEARED!</h4>
            <p className="text-xs font-mono text-zinc-400 mb-6 max-w-xs">
              All 8 tech stacks synced in <span className="text-amber-400 font-bold">{moves} moves</span> and <span className="text-emerald-400 font-bold">{formatTime(seconds)}</span>!
            </p>
            <button
              onClick={initGame}
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 text-[11px] font-mono text-zinc-500 text-center">
        Flip and match pairs of developer stacks · Find all 8 pairs in the fewest moves
      </div>
    </div>
  );
}
