import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Flame, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('siva_snake_highscore') || '0', 10);
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [speed, setSpeed] = useState(120);

  const nextDirectionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      const collides = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!collides) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setSpeed(120);
  };

  const handleKeyDown = useCallback((e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' || e.code === 'Space') {
      if (isGameOver) {
        resetGame();
      } else {
        setIsPlaying(prev => !prev);
      }
      return;
    }

    const cur = direction;
    if ((e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') && cur.y === 0) {
      nextDirectionRef.current = { x: 0, y: -1 };
    } else if ((e.key === 'ArrowDown' || e.key.toLowerCase() === 's') && cur.y === 0) {
      nextDirectionRef.current = { x: 0, y: 1 };
    } else if ((e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') && cur.x === 0) {
      nextDirectionRef.current = { x: -1, y: 0 };
    } else if ((e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') && cur.x === 0) {
      nextDirectionRef.current = { x: 1, y: 0 };
    }
  }, [direction, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    setDirection(nextDirectionRef.current);
    const head = snake[0];
    const newHead = {
      x: head.x + nextDirectionRef.current.x,
      y: head.y + nextDirectionRef.current.y
    };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      setIsGameOver(true);
      setIsPlaying(false);
      return;
    }

    // Self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setIsGameOver(true);
      setIsPlaying(false);
      return;
    }

    const newSnake = [newHead, ...snake];

    // Food collision
    if (newHead.x === food.x && newHead.y === food.y) {
      const newScore = score + 10;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('siva_snake_highscore', newScore.toString());
      }
      setFood(generateFood(newSnake));
      // Progressive acceleration
      setSpeed(prev => Math.max(70, prev - 2));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [isPlaying, isGameOver, snake, food, score, highScore, generateFood]);

  useEffect(() => {
    const timer = setInterval(moveSnake, speed);
    return () => clearInterval(timer);
  }, [moveSnake, speed]);

  const changeDirMobile = (dx, dy) => {
    if (dx !== 0 && direction.x === 0) nextDirectionRef.current = { x: dx, y: 0 };
    if (dy !== 0 && direction.y === 0) nextDirectionRef.current = { x: 0, y: dy };
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-[#0a0a0f]/90 p-5 md:p-8 flex flex-col items-center">
      
      {/* Top Arcade Status Bar */}
      <div className="w-full max-w-md flex items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-800/80 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-zinc-400">SCORE:</span>
          <span className="text-emerald-400 font-bold text-sm">{score}</span>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-zinc-400">HIGH:</span>
          <span className="text-amber-400 font-bold text-sm">{highScore}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (isGameOver) resetGame();
              else setIsPlaying(!isPlaying);
            }}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors flex items-center gap-1"
          >
            {isGameOver ? <RotateCcw className="w-3 h-3" /> : isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isGameOver ? 'AGAIN' : isPlaying ? 'PAUSE' : 'START'}</span>
          </button>
        </div>
      </div>

      {/* Game Canvas Board */}
      <div className="relative w-full max-w-[360px] aspect-square rounded-xl overflow-hidden border-2 border-emerald-500/30 bg-[#050508] shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        {/* Subtle Neon Grid Lines */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Snake Segments */}
        {snake.map((seg, idx) => {
          const isHead = idx === 0;
          return (
            <div
              key={idx}
              className="absolute rounded-sm transition-all duration-75"
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(seg.x / GRID_SIZE) * 100}%`,
                top: `${(seg.y / GRID_SIZE) * 100}%`,
                background: isHead
                  ? 'linear-gradient(135deg, #34d399, #10b981)'
                  : 'linear-gradient(135deg, #059669, #047857)',
                boxShadow: isHead ? '0 0 10px rgba(52,211,153,0.8)' : 'none',
                zIndex: isHead ? 2 : 1
              }}
            />
          );
        })}

        {/* Food Pellet */}
        <div
          className="absolute rounded-full animate-bounce"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            background: 'radial-gradient(circle, #fb7185 20%, #e11d48 80%)',
            boxShadow: '0 0 12px #fb7185',
            zIndex: 3
          }}
        />

        {/* Overlay: Game Over */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-10 animate-fade-in">
            <span className="text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">SYSTEM CRASH</span>
            <h4 className="text-2xl font-bold font-grotesk text-white mb-2">GAME OVER</h4>
            <p className="text-xs font-mono text-zinc-400 mb-4">Final Score: <span className="text-emerald-400 font-bold">{score}</span></p>
            <button
              onClick={resetGame}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" /> PLAY AGAIN (SPACE)
            </button>
          </div>
        )}

        {/* Overlay: Ready to start */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-10">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-2">RETRO SNAKE 2088</span>
            <button
              onClick={() => setIsPlaying(true)}
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-black" /> START GAME
            </button>
            <span className="text-[10px] font-mono text-zinc-500 mt-3">Use Arrow Keys or WASD</span>
          </div>
        )}
      </div>

      {/* On-screen D-Pad Controls for Mobile / Touch */}
      <div className="mt-4 flex flex-col items-center gap-1 sm:hidden">
        <button
          onClick={() => changeDirMobile(0, -1)}
          className="p-3 bg-zinc-800 active:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700"
          aria-label="Up"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeDirMobile(-1, 0)}
            className="p-3 bg-zinc-800 active:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700"
            aria-label="Left"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => changeDirMobile(0, 1)}
            className="p-3 bg-zinc-800 active:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700"
            aria-label="Down"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => changeDirMobile(1, 0)}
            className="p-3 bg-zinc-800 active:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700"
            aria-label="Right"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 text-[11px] font-mono text-zinc-500 text-center">
        Control with Arrow Keys or <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">W</kbd> <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">A</kbd> <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">S</kbd> <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">D</kbd> · Press Space to Pause
      </div>
    </div>
  );
}
