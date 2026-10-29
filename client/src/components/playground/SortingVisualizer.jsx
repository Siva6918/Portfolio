import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BarChart2, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Flame, 
  Crosshair, 
  Zap, 
  Volume2, 
  VolumeX, 
  Sliders,
  CheckCircle2,
  ArrowRightLeft
} from 'lucide-react';

const ALGORITHMS = [
  { id: 'bubble', name: 'Bubble Sort', complexity: 'O(n²)', desc: 'Pairwise adjacent swapping' },
  { id: 'selection', name: 'Selection Sort', complexity: 'O(n²)', desc: 'Finds minimum element each pass' },
  { id: 'insertion', name: 'Insertion Sort', complexity: 'O(n²)', desc: 'Builds sorted array one item at a time' },
  { id: 'quick', name: 'Quick Sort', complexity: 'O(n log n)', desc: 'Divide-and-conquer pivot partition' }
];

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState('bubble');
  const [speedMs, setSpeedMs] = useState(40); // delay in ms
  const [arraySize, setArraySize] = useState(25);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Visual states
  const [activeIndices, setActiveIndices] = useState([]);
  const [swapIndices, setSwapIndices] = useState([]);
  const [pivotIndex, setPivotIndex] = useState(null);
  const [sortedIndices, setSortedIndices] = useState(new Set());
  
  // Telemetry metrics
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Ready to sort. Click "START SORT RACE" to begin.');

  // Control refs to handle pausing / stopping asynchronously
  const isCancelledRef = useRef(false);
  const isPausedRef = useRef(false);
  const speedRef = useRef(speedMs);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    speedRef.current = speedMs;
  }, [speedMs]);

  useEffect(() => {
    isPausedRef.current = paused;
  }, [paused]);

  // Audio frequency synthesizer
  const playTone = useCallback((value, maxValue = 100) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const freq = 200 + (value / maxValue) * 600;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio policy safe
    }
  }, [soundEnabled]);

  // Generate randomized array
  const generateArray = useCallback((size = arraySize) => {
    isCancelledRef.current = true;
    setSorting(false);
    setPaused(false);
    setActiveIndices([]);
    setSwapIndices([]);
    setPivotIndex(null);
    setSortedIndices(new Set());
    setComparisons(0);
    setSwaps(0);
    setStatusMessage('Generated randomized array telemetry.');

    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 88) + 12);
    setArray(newArr);
  }, [arraySize]);

  useEffect(() => {
    generateArray(arraySize);
  }, [arraySize, generateArray]);

  // Sleep utility that respects pause & cancel
  const sleep = async () => {
    while (isPausedRef.current && !isCancelledRef.current) {
      await new Promise((r) => setTimeout(r, 80));
    }
    if (isCancelledRef.current) {
      throw new Error('SORT_CANCELLED');
    }
    await new Promise((r) => setTimeout(r, speedRef.current));
  };

  // ─── BUBBLE SORT ───
  const runBubbleSort = async (arr) => {
    const n = arr.length;
    let cmp = 0;
    let swp = 0;
    const sorted = new Set();

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        cmp++;
        setComparisons(cmp);
        setStatusMessage(`Comparing index ${j} (${arr[j]}) against index ${j + 1} (${arr[j + 1]})`);
        playTone(arr[j]);
        await sleep();

        if (arr[j] > arr[j + 1]) {
          setSwapIndices([j, j + 1]);
          swp++;
          setSwaps(swp);
          setStatusMessage(`Swapping ${arr[j]} > ${arr[j + 1]}`);
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          playTone(arr[j + 1]);
          await sleep();
          setSwapIndices([]);
        }
      }
      sorted.add(n - i - 1);
      setSortedIndices(new Set(sorted));
    }
    sorted.add(0);
    setSortedIndices(new Set(sorted));
  };

  // ─── SELECTION SORT ───
  const runSelectionSort = async (arr) => {
    const n = arr.length;
    let cmp = 0;
    let swp = 0;
    const sorted = new Set();

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      setPivotIndex(minIdx);
      setStatusMessage(`Scanning for minimum element starting at index ${i}`);

      for (let j = i + 1; j < n; j++) {
        setActiveIndices([j, minIdx]);
        cmp++;
        setComparisons(cmp);
        playTone(arr[j]);
        await sleep();

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          setPivotIndex(minIdx);
          setStatusMessage(`New minimum found: ${arr[minIdx]} at index ${minIdx}`);
        }
      }

      if (minIdx !== i) {
        setSwapIndices([i, minIdx]);
        swp++;
        setSwaps(swp);
        setStatusMessage(`Swapping minimum ${arr[minIdx]} into sorted position ${i}`);
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        setArray([...arr]);
        playTone(arr[i]);
        await sleep();
        setSwapIndices([]);
      }
      sorted.add(i);
      setSortedIndices(new Set(sorted));
    }
    setPivotIndex(null);
  };

  // ─── INSERTION SORT ───
  const runInsertionSort = async (arr) => {
    const n = arr.length;
    let cmp = 0;
    let swp = 0;
    const sorted = new Set([0]);
    setSortedIndices(new Set(sorted));

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      setPivotIndex(i);
      setStatusMessage(`Inserting key ${key} into sorted partition [0..${i - 1}]`);

      while (j >= 0) {
        setActiveIndices([j, j + 1]);
        cmp++;
        setComparisons(cmp);
        playTone(arr[j]);
        await sleep();

        if (arr[j] > key) {
          setSwapIndices([j, j + 1]);
          swp++;
          setSwaps(swp);
          arr[j + 1] = arr[j];
          setArray([...arr]);
          await sleep();
          setSwapIndices([]);
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
      setArray([...arr]);
      sorted.add(i);
      setSortedIndices(new Set(sorted));
    }
    setPivotIndex(null);
  };

  // ─── QUICK SORT ───
  const runQuickSort = async (arr) => {
    let cmp = 0;
    let swp = 0;
    const sorted = new Set();

    const partition = async (low, high) => {
      const pivotVal = arr[high];
      setPivotIndex(high);
      let i = low - 1;
      setStatusMessage(`Partitioning [${low}..${high}] with pivot ${pivotVal} (index ${high})`);

      for (let j = low; j < high; j++) {
        setActiveIndices([j, high]);
        cmp++;
        setComparisons(cmp);
        playTone(arr[j]);
        await sleep();

        if (arr[j] < pivotVal) {
          i++;
          if (i !== j) {
            setSwapIndices([i, j]);
            swp++;
            setSwaps(swp);
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            setArray([...arr]);
            playTone(arr[i]);
            await sleep();
            setSwapIndices([]);
          }
        }
      }

      const pTarget = i + 1;
      if (pTarget !== high) {
        setSwapIndices([pTarget, high]);
        swp++;
        setSwaps(swp);
        const temp = arr[pTarget];
        arr[pTarget] = arr[high];
        arr[high] = temp;
        setArray([...arr]);
        playTone(arr[pTarget]);
        await sleep();
        setSwapIndices([]);
      }
      sorted.add(pTarget);
      setSortedIndices(new Set(sorted));
      return pTarget;
    };

    const quickSortHelper = async (low, high) => {
      if (low < high) {
        const pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      } else if (low === high) {
        sorted.add(low);
        setSortedIndices(new Set(sorted));
      }
    };

    await quickSortHelper(0, arr.length - 1);
    for (let k = 0; k < arr.length; k++) sorted.add(k);
    setSortedIndices(new Set(sorted));
    setPivotIndex(null);
  };

  // Main Sort Launcher
  const handleStartSort = async () => {
    if (sorting && !paused) {
      setPaused(true);
      return;
    }
    if (sorting && paused) {
      setPaused(false);
      return;
    }

    isCancelledRef.current = false;
    isPausedRef.current = false;
    setSorting(true);
    setPaused(false);
    setSortedIndices(new Set());
    setComparisons(0);
    setSwaps(0);

    const workingArray = [...array];

    try {
      if (selectedAlgo === 'bubble') {
        await runBubbleSort(workingArray);
      } else if (selectedAlgo === 'selection') {
        await runSelectionSort(workingArray);
      } else if (selectedAlgo === 'insertion') {
        await runInsertionSort(workingArray);
      } else if (selectedAlgo === 'quick') {
        await runQuickSort(workingArray);
      }

      setActiveIndices([]);
      setSwapIndices([]);
      setPivotIndex(null);
      setStatusMessage(`✨ Sort Complete! All ${workingArray.length} elements ordered.`);

      // Victory sound wave
      if (soundEnabled) {
        for (let i = 0; i < workingArray.length; i += 3) {
          playTone(workingArray[i]);
          await new Promise((r) => setTimeout(r, 20));
        }
      }
    } catch (e) {
      // Sort was cancelled
      setStatusMessage('Sorting paused or reset.');
    } finally {
      setSorting(false);
      setPaused(false);
    }
  };

  const maxValue = Math.max(...array, 100);

  return (
    <div className="w-full rounded-2xl border border-[#242834] bg-[#0c0c12] p-5 sm:p-7 md:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden transition-all">
      
      {/* Background glowing accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-marigold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-neonRose/5 rounded-full blur-3xl pointer-events-none" />

      {/* ─── TOP HEADER & ALGO SELECTOR TRAY ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#242834]">
        
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-marigold to-neonRose text-black shadow-md shadow-marigold/20">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-marigold px-2 py-0.5 rounded-full bg-marigold/10 border border-marigold/30">
                HIGH-SPEED ALGORITHM ARENA
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {ALGORITHMS.find(a => a.id === selectedAlgo)?.complexity}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-grotesk text-white mt-0.5">
              Sorting Algorithm Race
            </h3>
          </div>
        </div>

        {/* Algorithm Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#08080a] border border-[#242834]">
          {ALGORITHMS.map((algo) => {
            const isSelected = selectedAlgo === algo.id;
            return (
              <button
                key={algo.id}
                onClick={() => {
                  if (sorting) return;
                  setSelectedAlgo(algo.id);
                  setStatusMessage(`Selected ${algo.name}: ${algo.desc}`);
                }}
                disabled={sorting}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50 ${
                  isSelected
                    ? 'bg-gradient-to-r from-marigold to-neonRose text-black shadow-md shadow-marigold/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {algo.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── CONTROLS & SPEED BAR ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-[#08080a] border border-[#242834]">
        
        {/* Left: Play / Pause / Randomize */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleStartSort}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black transition-all shadow-md active:scale-95 ${
              sorting && !paused
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-90'
                : 'bg-gradient-to-r from-marigold to-neonRose hover:opacity-90'
            }`}
          >
            {sorting && !paused ? (
              <>
                <Pause className="w-4 h-4 fill-black" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>{paused ? 'RESUME RACE' : 'START SORT RACE'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => generateArray(arraySize)}
            disabled={sorting && !paused}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#14141c] hover:bg-[#1a1a24] text-zinc-300 hover:text-white font-mono text-xs border border-[#242834] transition-all disabled:opacity-50 active:scale-95"
            title="Randomize array with fresh values"
          >
            <RotateCcw className="w-3.5 h-3.5 text-marigold" />
            <span>RANDOMIZE</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs transition-all ${
              soundEnabled
                ? 'bg-marigold/10 border-marigold/30 text-marigold'
                : 'bg-[#14141c] border-[#242834] text-zinc-500'
            }`}
            title={soundEnabled ? 'Mute tone synthesizer' : 'Enable audio synthesizer'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Right: Array Size & Speed Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
          
          {/* Array Size */}
          <div className="flex items-center gap-2">
            <span>Size:</span>
            {[15, 25, 40].map((sz) => (
              <button
                key={sz}
                onClick={() => !sorting && setArraySize(sz)}
                disabled={sorting}
                className={`px-2 py-0.5 rounded-md border text-[11px] transition-all disabled:opacity-50 ${
                  arraySize === sz
                    ? 'border-marigold text-marigold bg-marigold/10 font-bold'
                    : 'border-[#242834] bg-[#14141c] text-zinc-400 hover:text-white'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Speed */}
          <div className="flex items-center gap-2">
            <span>Speed:</span>
            {[
              { label: '1x', ms: 70 },
              { label: '2x', ms: 30 },
              { label: '5x', ms: 10 }
            ].map((spd) => (
              <button
                key={spd.label}
                onClick={() => setSpeedMs(spd.ms)}
                className={`px-2 py-0.5 rounded-md border text-[11px] transition-all ${
                  speedMs === spd.ms
                    ? 'border-neonRose text-neonRose bg-neonRose/10 font-bold'
                    : 'border-[#242834] bg-[#14141c] text-zinc-400 hover:text-white'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── ARRAY BARS VISUALIZATION STAGE (ROBUST EXPLICIT HEIGHT) ─── */}
      <div className="w-full h-[280px] sm:h-[320px] md:h-[340px] bg-[#08080a] border border-[#242834] rounded-2xl relative p-4 sm:p-6 flex items-end justify-center gap-1 sm:gap-1.5 md:gap-2 shadow-inner overflow-hidden">
        
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(226,232,240,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {array.map((value, idx) => {
          const isSorted = sortedIndices.has(idx);
          const isPivot = pivotIndex === idx;
          const isSwap = swapIndices.includes(idx);
          const isActive = activeIndices.includes(idx);

          // Color & Glow Determination
          let barGradient = 'from-slate-700 to-zinc-800';
          let borderClass = 'border-t border-[#475569]';
          let glowStyle = {};

          if (isPivot) {
            barGradient = 'from-solarAmber to-amber-400';
            borderClass = 'border-t-2 border-white';
            glowStyle = { boxShadow: '0 0 16px rgba(251,191,36,0.6)' };
          } else if (isSwap) {
            barGradient = 'from-neonRose to-rose-400';
            borderClass = 'border-t-2 border-white';
            glowStyle = { boxShadow: '0 0 20px rgba(244,63,94,0.7)', transform: 'scaleY(1.04)' };
          } else if (isActive) {
            barGradient = 'from-marigold to-amber-300';
            borderClass = 'border-t-2 border-white';
            glowStyle = { boxShadow: '0 0 14px rgba(245,158,11,0.5)' };
          } else if (isSorted) {
            barGradient = 'from-marigold via-neonRose to-rose-500';
            borderClass = 'border-t-2 border-white';
            glowStyle = { boxShadow: '0 0 8px rgba(244,63,94,0.35)' };
          }

          // Exact pixel height calculation so it NEVER collapses
          const heightPx = Math.max(16, Math.round((value / maxValue) * 230));

          return (
            <div 
              key={idx}
              className="flex flex-col items-center flex-1 max-w-[40px] group transition-all duration-100"
            >
              {/* Optional Bar Value (visible on hover or when larger) */}
              <span className={`text-[10px] font-mono mb-1 transition-all ${
                isActive || isSwap || isPivot ? 'text-white font-bold opacity-100 scale-110' : 'text-zinc-500 opacity-60 group-hover:opacity-100'
              }`}>
                {value}
              </span>

              {/* The Visual Bar */}
              <div 
                className={`w-full rounded-t-md bg-gradient-to-t ${barGradient} ${borderClass} transition-all duration-75 relative`}
                style={{ 
                  height: `${heightPx}px`,
                  ...glowStyle 
                }}
              >
                {/* Highlight cap */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40 rounded-t-md" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── LIVE TELEMETRY & STATUS BANNER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#08080a] border border-[#242834]">
        
        {/* Current Step Description */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-marigold/10 border border-marigold/30 text-marigold">
            <Zap className="w-4 h-4 fill-marigold" />
          </div>
          <span className="font-mono text-xs text-iceSilver font-medium leading-relaxed">
            {statusMessage}
          </span>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">CMP:</span>
            <span className="font-bold text-marigold">{comparisons}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">SWAPS:</span>
            <span className="font-bold text-neonRose">{swaps}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">SORTED:</span>
            <span className="font-bold text-emerald-400">{sortedIndices.size}/{array.length}</span>
          </div>
        </div>
      </div>

      {/* ─── COLOR LEGEND ─── */}
      <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-mono text-zinc-400 pt-1 border-t border-[#242834]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-700 border border-slate-500" />
          <span>Unsorted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-marigold border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <span>Active / Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-neonRose border border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
          <span>Swapping / Moving</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-solarAmber border border-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          <span>Pivot / Minimum</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-marigold to-neonRose border border-white" />
          <span>Sorted Array</span>
        </div>
      </div>

    </div>
  );
};

export default SortingVisualizer;
