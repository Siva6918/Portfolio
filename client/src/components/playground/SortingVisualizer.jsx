import React, { useState, useEffect } from 'react';
import { BarChart2, Play, RotateCcw, FastForward } from 'lucide-react';

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);

  // Generate random array
  const generateArray = () => {
    if (sorting) return;
    const newArray = Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    setSortedIndices([]);
    setActiveIndices([]);
  };

  useEffect(() => {
    generateArray();
  }, []);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    if (sorting) return;
    setSorting(true);
    let arr = [...array];
    let sorted = [];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          // Swap
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
        }
        await sleep(speed);
      }
      sorted.push(arr.length - i - 1);
      setSortedIndices([...sorted]);
    }
    
    // Mark the first element as sorted too
    sorted.push(0);
    setSortedIndices([...sorted]);
    setActiveIndices([]);
    setSorting(false);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-[#0c0c12]/50 p-6 md:p-8 flex flex-col gap-8 min-h-[450px]">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white font-grotesk">Algo Visualizer</h3>
            <p className="text-xs text-slate-500 font-mono">Bubble Sort Animation</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={generateArray}
            disabled={sorting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-xs font-mono font-bold transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Randomize
          </button>

          <button 
            onClick={() => setSpeed(speed === 50 ? 10 : 50)}
            disabled={sorting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-xs font-mono font-bold transition-colors disabled:opacity-50"
          >
            <FastForward className="w-3.5 h-3.5" /> {speed === 50 ? 'Speed: 1x' : 'Speed: 5x'}
          </button>

          <button 
            onClick={bubbleSort}
            disabled={sorting || sortedIndices.length === array.length}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-mono font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
          >
            <Play className="w-3.5 h-3.5" /> Sort
          </button>
        </div>
      </div>

      {/* Array Bars Visualization */}
      <div className="flex-grow flex items-end justify-center gap-[2px] sm:gap-1 px-2 pb-4">
        {array.map((value, idx) => {
          let bgColor = "bg-slate-300 dark:bg-zinc-700";
          if (activeIndices.includes(idx)) {
            bgColor = "bg-rose-500";
          } else if (sortedIndices.includes(idx)) {
            bgColor = "bg-emerald-500";
          }

          return (
            <div 
              key={idx}
              className={`w-3 sm:w-5 md:w-6 rounded-t-sm transition-all duration-75 ${bgColor}`}
              style={{ height: `${(value / 110) * 100}%` }}
            >
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default SortingVisualizer;
