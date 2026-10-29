import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, RotateCcw, Zap, Target, Award, Play } from 'lucide-react';

const SNIPPETS = [
  {
    title: 'React Custom Hook',
    code: 'const useDebounce = (val, delay = 300) => { useEffect(() => { const h = setTimeout(() => set(val), delay); return () => clearTimeout(h); }, [val]); };'
  },
  {
    title: 'Async API Fetcher',
    code: 'async function fetchTelemetry(endpoint) { const res = await fetch(`/api/${endpoint}`); if (!res.ok) throw new Error("Network error"); return res.json(); }'
  },
  {
    title: 'Binary Search Algorithm',
    code: 'function binarySearch(arr, target) { let lo = 0, hi = arr.length - 1; while (lo <= hi) { const mid = (lo + hi) >> 1; if (arr[mid] === target) return mid; } return -1; }'
  },
  {
    title: 'Distributed Redis Cache',
    code: 'await redis.set(`user:${id}:session`, JSON.stringify(sessionData), "EX", 3600); const cached = await redis.get(`user:${id}:session`);'
  }
];

export default function SpeedTyperGame() {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const inputRef = useRef(null);

  const targetText = SNIPPETS[snippetIndex].code;

  const startTest = () => {
    setInput('');
    setTimeLeft(30);
    setIsActive(true);
    setIsFinished(false);
    setStartTime(Date.now());
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const resetTest = () => {
    setInput('');
    setTimeLeft(30);
    setIsActive(false);
    setIsFinished(false);
    setStartTime(null);
  };

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setIsFinished(true);
            setIsActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Calculate metrics
  let correctChars = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === targetText[i]) {
      correctChars++;
    }
  }

  const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;
  const timeElapsed = startTime ? Math.max(1, (Date.now() - startTime) / 1000) : 1;
  const wordsTyped = correctChars / 5;
  const wpm = Math.round((wordsTyped / (timeElapsed / 60))) || 0;

  const handleInputChange = (e) => {
    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
    }
    const val = e.target.value;
    setInput(val);

    if (val.length >= targetText.length) {
      setIsFinished(true);
      setIsActive(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-[#0a0a0f]/90 p-5 md:p-8 flex flex-col items-center">
      {/* Header Info */}
      <div className="w-full max-w-xl flex items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-800/80 font-mono text-xs">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-zinc-400">WPM:</span>
          <span className="text-amber-400 font-bold text-sm">{wpm}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Target className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-400">ACCURACY:</span>
          <span className="text-emerald-400 font-bold text-sm">{accuracy}%</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-zinc-400">TIME:</span>
          <span className={`font-bold text-sm ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-blue-400'}`}>
            {timeLeft}s
          </span>
        </div>

        <button
          onClick={resetTest}
          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
          title="Reset Test"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Snippet Selector Pills */}
      <div className="w-full max-w-xl flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {SNIPPETS.map((snip, idx) => (
          <button
            key={snip.title}
            onClick={() => {
              setSnippetIndex(idx);
              resetTest();
            }}
            className={`px-3 py-1 rounded-md text-[11px] font-mono whitespace-nowrap border transition-colors ${
              snippetIndex === idx
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 font-bold'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {snip.title}
          </button>
        ))}
      </div>

      {/* Code Display Area with character feedback */}
      <div className="w-full max-w-xl p-4 sm:p-5 rounded-xl border border-zinc-800 bg-[#060609] font-mono text-xs sm:text-sm leading-relaxed tracking-wide min-h-[120px] relative select-none">
        {targetText.split('').map((char, index) => {
          let color = 'text-zinc-500';
          let bg = '';
          const isCurrent = index === input.length;

          if (index < input.length) {
            if (input[index] === char) {
              color = 'text-emerald-400 font-bold';
            } else {
              color = 'text-rose-500 bg-rose-500/20 font-bold';
            }
          }

          return (
            <span
              key={index}
              className={`${color} ${bg} ${isCurrent ? 'border-b-2 border-blue-400 animate-pulse' : ''}`}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Typing Input */}
      <div className="w-full max-w-xl mt-4 relative">
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          disabled={isFinished}
          placeholder={isActive ? "Type code here..." : "Click Start or type here to begin 30s challenge..."}
          rows={2}
          className="w-full bg-[#111118] border border-zinc-800 focus:border-blue-500 rounded-xl p-3 font-mono text-xs sm:text-sm text-zinc-200 outline-none resize-none transition-colors"
        />

        {!isActive && !isFinished && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs rounded-xl flex items-center justify-center">
            <button
              onClick={startTest}
              className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> START SPEED TEST (30s)
            </button>
          </div>
        )}

        {/* Finished Modal */}
        {isFinished && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-4 text-center z-10 border border-blue-500/40">
            <Award className="w-8 h-8 text-amber-400 mb-1" />
            <h4 className="text-xl font-bold font-grotesk text-white">TEST COMPLETE</h4>
            <div className="flex items-center gap-4 my-2 text-xs font-mono">
              <span className="text-zinc-300">Speed: <strong className="text-amber-400 text-sm">{wpm} WPM</strong></span>
              <span className="text-zinc-300">Accuracy: <strong className="text-emerald-400 text-sm">{accuracy}%</strong></span>
            </div>
            <button
              onClick={startTest}
              className="mt-2 px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> RETRY TEST
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-[11px] font-mono text-zinc-500 text-center">
        Type the code snippet with speed and accuracy · 30-second developer challenge
      </div>
    </div>
  );
}
