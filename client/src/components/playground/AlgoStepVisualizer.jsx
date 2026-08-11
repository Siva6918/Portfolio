import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  BarChart2, 
  Info, 
  X, 
  ArrowLeftRight, 
  CheckCircle2, 
  Target, 
  Search,
  Activity
} from 'lucide-react';

/**
 * Generates an array of step snapshots for Lomuto QuickSort.
 * Each step snapshot is an immutable object capturing the exact execution state.
 */
function generateQuickSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set();

  // Step 0: Initial State
  steps.push({
    array: [...arr],
    type: 'initial',
    activeIndices: [],
    pivotIndex: null,
    low: 0,
    high: arr.length - 1,
    iIndex: null,
    jIndex: null,
    sortedIndices: new Set(sortedIndices),
    description: 'Initial unsorted array state. Click "SORT STEP" or "AUTO RUN" to begin step-by-step visualization.',
    comparisons: 0,
    swaps: 0
  });

  function quickSortHelper(low, high) {
    if (low > high) return;

    if (low === high) {
      sortedIndices.add(low);
      steps.push({
        array: [...arr],
        type: 'single-sorted',
        activeIndices: [low],
        pivotIndex: low,
        low,
        high,
        iIndex: null,
        jIndex: null,
        sortedIndices: new Set(sortedIndices),
        description: `Subarray has single element at index ${low} (${arr[low]}). Marked as sorted.`,
        comparisons,
        swaps
      });
      return;
    }

    const pivotVal = arr[high];
    let i = low - 1;

    steps.push({
      array: [...arr],
      type: 'pivot-select',
      activeIndices: [high],
      pivotIndex: high,
      low,
      high,
      iIndex: null,
      jIndex: null,
      sortedIndices: new Set(sortedIndices),
      description: `Selected pivot value ${pivotVal} at index ${high} for partition range [${low}..${high}].`,
      comparisons,
      swaps
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({
        array: [...arr],
        type: 'compare',
        activeIndices: [j, high],
        pivotIndex: high,
        low,
        high,
        iIndex: i >= low ? i : null,
        jIndex: j,
        sortedIndices: new Set(sortedIndices),
        description: `Comparing element ${arr[j]} (index ${j}) against pivot ${pivotVal} (index ${high}).`,
        comparisons,
        swaps
      });

      if (arr[j] < pivotVal) {
        i++;
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          swaps++;

          steps.push({
            array: [...arr],
            type: 'swap',
            activeIndices: [i, j],
            pivotIndex: high,
            low,
            high,
            iIndex: i,
            jIndex: j,
            sortedIndices: new Set(sortedIndices),
            description: `Swapping index ${i} (${arr[i]}) and index ${j} (${arr[j]}) as ${arr[i]} < pivot (${pivotVal}).`,
            comparisons,
            swaps
          });
        }
      }
    }

    const pivotTarget = i + 1;
    if (pivotTarget !== high) {
      const temp = arr[pivotTarget];
      arr[pivotTarget] = arr[high];
      arr[high] = temp;
      swaps++;
    }
    sortedIndices.add(pivotTarget);

    steps.push({
      array: [...arr],
      type: 'pivot-placed',
      activeIndices: [pivotTarget],
      pivotIndex: pivotTarget,
      low,
      high,
      iIndex: pivotTarget,
      jIndex: null,
      sortedIndices: new Set(sortedIndices),
      description: `Placed pivot ${pivotVal} into its final sorted position at index ${pivotTarget}.`,
      comparisons,
      swaps
    });

    quickSortHelper(low, pivotTarget - 1);
    quickSortHelper(pivotTarget + 1, high);
  }

  quickSortHelper(0, arr.length - 1);

  for (let idx = 0; idx < arr.length; idx++) {
    sortedIndices.add(idx);
  }

  steps.push({
    array: [...arr],
    type: 'complete',
    activeIndices: [],
    pivotIndex: null,
    low: 0,
    high: arr.length - 1,
    iIndex: null,
    jIndex: null,
    sortedIndices: new Set(sortedIndices),
    description: `QuickSort completed successfully! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    comparisons,
    swaps
  });

  return steps;
}

const INITIAL_ARRAY = [38, 12, 74, 25, 90, 45, 61];

const AlgoStepVisualizer = ({ className = '' }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(600); // ms per step
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(false);

  // Precompute steps deterministically
  const steps = useMemo(() => generateQuickSortSteps(INITIAL_ARRAY), []);
  const totalSteps = steps.length - 1; // Step 0 to totalSteps
  const currentStep = steps[currentStepIndex] || steps[0];
  const isCompleted = currentStepIndex >= totalSteps;

  // Handle Auto-Run playback
  useEffect(() => {
    let timer = null;
    if (isPlaying && !isCompleted) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else if (isCompleted) {
      setIsPlaying(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, isCompleted, totalSteps, playbackSpeed]);

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < totalSteps) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex, totalSteps]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const togglePlay = useCallback(() => {
    if (isCompleted) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [isCompleted]);

  // Determine styling for each bar
  const getBarConfig = (val, idx) => {
    const isSorted = currentStep.sortedIndices?.has(idx);
    const isPivot = currentStep.pivotIndex === idx;
    const isActive = currentStep.activeIndices?.includes(idx);
    const isCompare = currentStep.type === 'compare' && isActive;
    const isSwap = currentStep.type === 'swap' && isActive;

    let colorClasses = 'bg-slate-700 dark:bg-zinc-800 text-slate-300 border-slate-600';
    let badgeText = '';

    if (isPivot) {
      colorClasses = 'bg-gradient-to-t from-purple-600 to-indigo-500 ring-2 ring-purple-400 shadow-lg shadow-purple-500/30 text-white';
      badgeText = 'PIVOT';
    } else if (isSwap) {
      colorClasses = 'bg-gradient-to-t from-rose-600 to-red-500 ring-2 ring-rose-400 scale-105 shadow-lg shadow-rose-500/40 text-white animate-pulse';
      badgeText = 'SWAP';
    } else if (isCompare) {
      colorClasses = 'bg-gradient-to-t from-amber-500 to-yellow-400 ring-2 ring-amber-300 text-slate-950 font-bold shadow-md shadow-amber-500/30';
      badgeText = 'CMP';
    } else if (isSorted) {
      colorClasses = 'bg-gradient-to-t from-emerald-600 to-teal-500 ring-1 ring-emerald-400/50 text-white';
      badgeText = 'SORTED';
    } else {
      colorClasses = 'bg-gradient-to-t from-indigo-900/60 to-slate-700 dark:from-zinc-800 dark:to-zinc-700 text-slate-300';
    }

    // Check pointer tags
    const pointerLabels = [];
    if (currentStep.iIndex === idx) pointerLabels.push('i');
    if (currentStep.jIndex === idx) pointerLabels.push('j');

    return { colorClasses, badgeText, pointerLabels };
  };

  const finalStep = steps[steps.length - 1];

  return (
    <div className={`editorial-card p-5 sm:p-8 space-y-6 relative overflow-hidden flex flex-col justify-between min-h-[540px] sm:min-h-[480px] h-full ${className}`}>
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-mono font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>QuickSort Visualizer</span>
          </span>
          <span className="text-xs font-mono text-slate-500 dark:text-white/50">
            Lomuto Partition
          </span>
        </div>

        {/* Step Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-indigo-600/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
            Step {currentStepIndex} / {totalSteps}
          </div>
          <button
            onClick={() => setIsAnalyzeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-mono text-xs transition-all shadow-sm"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>ANALYZE</span>
          </button>
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-zinc-950/60 p-3 rounded-2xl border border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          {/* SORT STEP */}
          <button
            onClick={handleNextStep}
            disabled={isCompleted || isPlaying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-mono text-xs font-semibold transition-all shadow-md active:scale-95"
            title="Execute next single algorithm step"
          >
            <SkipForward className="w-4 h-4" />
            <span>SORT STEP</span>
          </button>

          {/* AUTO RUN / PLAY */}
          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-mono text-xs font-semibold transition-all shadow-md active:scale-95 ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-500'
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{isCompleted ? 'REPLAY' : 'AUTO RUN'}</span>
              </>
            )}
          </button>

          {/* RESET */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-mono text-xs transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-zinc-400">
          <span>Speed:</span>
          {[
            { label: '1x', ms: 700 },
            { label: '2x', ms: 350 },
            { label: '4x', ms: 150 }
          ].map((spd) => (
            <button
              key={spd.label}
              onClick={() => setPlaybackSpeed(spd.ms)}
              className={`px-2 py-0.5 rounded-md border text-[11px] transition-all ${
                playbackSpeed === spd.ms
                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
              }`}
            >
              {spd.label}
            </button>
          ))}
        </div>
      </div>

      {/* Array Bars Visualization Container */}
      <div className="relative pt-6 pb-4 px-2 sm:px-6 rounded-2xl bg-slate-900 dark:bg-zinc-950 border border-slate-800 min-h-[220px] flex items-end justify-center gap-2 sm:gap-4 shadow-inner">
        {currentStep.array.map((val, idx) => {
          const { colorClasses, badgeText, pointerLabels } = getBarConfig(val, idx);

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[56px] transition-all duration-300">
              {/* Badge above bar */}
              <div className="h-4 flex items-center justify-center">
                {badgeText && (
                  <span className="text-[9px] font-mono font-bold tracking-wider px-1 py-0.2 rounded bg-slate-950 text-amber-300 border border-amber-400/40 uppercase">
                    {badgeText}
                  </span>
                )}
              </div>

              {/* Bar Value */}
              <span className="text-xs font-mono font-bold text-zinc-300">
                {val}
              </span>

              {/* Graphical Bar */}
              <div
                className={`w-full rounded-t-lg transition-all duration-500 flex items-center justify-center ${colorClasses}`}
                style={{ height: `${Math.max(val * 1.5, 32)}px` }}
              >
                <span className="text-[10px] font-mono opacity-80 select-none">
                  [{idx}]
                </span>
              </div>

              {/* Pointer indicators below bar */}
              <div className="h-5 flex items-center justify-center gap-1">
                {pointerLabels.map((lbl) => (
                  <span
                    key={lbl}
                    className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-mono font-bold shadow-sm"
                  >
                    {lbl}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Explanation & Metrics Banner */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-start gap-2.5 flex-1">
          <div className="mt-0.5 p-1 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
            {currentStep.type === 'compare' && <Search className="w-4 h-4 text-amber-500" />}
            {currentStep.type === 'swap' && <ArrowLeftRight className="w-4 h-4 text-rose-500" />}
            {currentStep.type === 'pivot-select' && <Target className="w-4 h-4 text-purple-500" />}
            {currentStep.type === 'pivot-placed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            {currentStep.type === 'complete' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {currentStep.type === 'initial' && <Info className="w-4 h-4 text-indigo-400" />}
            {currentStep.type === 'single-sorted' && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
          </div>
          <span className="text-slate-800 dark:text-zinc-200 leading-relaxed font-semibold">
            {currentStep.description}
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400">
          <span>Comparisons: <strong className="text-amber-600 dark:text-amber-400 font-bold">{currentStep.comparisons}</strong></span>
          <span>Swaps: <strong className="text-rose-600 dark:text-rose-400 font-bold">{currentStep.swaps}</strong></span>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-500 border border-purple-400 inline-block" />
          <span>Pivot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-400 border border-amber-300 inline-block" />
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-500 border border-rose-400 inline-block" />
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400 inline-block" />
          <span>Sorted</span>
        </div>
      </div>

      {/* Analyze Modal Overlay */}
      {isAnalyzeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-sm">
                <BarChart2 className="w-4 h-4" />
                <span>QuickSort Complexity & Benchmark Analysis</span>
              </div>
              <button
                onClick={() => setIsAnalyzeOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 block text-[10px]">Algorithm</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">QuickSort</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 block mt-0.5">Lomuto Partition</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 block text-[10px]">Array Size (N)</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">N = {INITIAL_ARRAY.length}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 block mt-0.5">Elements</span>
                </div>
              </div>

              {/* Complexity Metrics Table */}
              <div className="p-4 rounded-xl bg-slate-900 text-zinc-200 border border-slate-800 space-y-2">
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Average Time Complexity:</span>
                  <span className="text-amber-400 font-bold">O(N log N)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Worst Case Time Complexity:</span>
                  <span className="text-rose-400 font-bold">O(N²)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-1.5">
                  <span className="text-zinc-400">Space Complexity:</span>
                  <span className="text-indigo-400 font-bold">O(log N) aux</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-zinc-400">Partition Method:</span>
                  <span className="text-emerald-400 font-bold">Lomuto Pivot</span>
                </div>
              </div>

              {/* Recorded Benchmark Totals */}
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 block text-xs">
                  Recorded Run Performance:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900">
                    <span className="block text-[10px] text-slate-500 dark:text-zinc-400">Total Steps</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{totalSteps}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900">
                    <span className="block text-[10px] text-slate-500 dark:text-zinc-400">Comparisons</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{finalStep.comparisons}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900">
                    <span className="block text-[10px] text-slate-500 dark:text-zinc-400">Swaps</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">{finalStep.swaps}</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
                QuickSort is a divide-and-conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot. Each step performs comparisons and swaps to position elements relative to the pivot.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsAnalyzeOpen(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold transition-all shadow-md"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgoStepVisualizer;
