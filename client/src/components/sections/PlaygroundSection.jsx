import React, { useState } from 'react';
import { Cpu, Play, RefreshCw, Code2, Zap } from 'lucide-react';

const PlaygroundSection = () => {
  const [activeTab, setActiveTab] = useState('ai-sim');

  // Mini AI Simulator State
  const [aiPrompt, setAiPrompt] = useState('How do you calculate candidate match score?');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Algorithm Visualizer State
  const [algoArray, setAlgoArray] = useState([38, 12, 74, 25, 90, 45, 61]);
  const [algoStep, setAlgoStep] = useState(0);

  // API Tester State
  const [apiLatency, setApiLatency] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const handleRunAi = () => {
    setIsAiLoading(true);
    setAiResponse('');
    
    setTimeout(() => {
      let resultText = '';
      if (aiPrompt.toLowerCase().includes('match') || aiPrompt.toLowerCase().includes('candidate')) {
        resultText = '[spaCy NLP Engine]: Extracted skills ["Java", "React", "Node.js"]. Matched against job requirement vector. Match percentage: 89.4%. Weight factor applied for 2+ years MERN experience.';
      } else if (aiPrompt.toLowerCase().includes('anomaly') || aiPrompt.toLowerCase().includes('risk')) {
        resultText = '[NutriCloud Monitor]: Behavioral anomaly detected. User session navigation frequency is 3.4x average. Risk Score calculated: 78/100 (HIGH RISK). Triggered MFA check.';
      } else {
        resultText = `[AI Integration Model]: Processed prompt "${aiPrompt}". Executed FastAPI microservice pipeline in 120ms with token efficiency score 98.2%.`;
      }
      setAiResponse(resultText);
      setIsAiLoading(false);
    }, 600);
  };

  const handleStepAlgo = () => {
    const sorted = [...algoArray].sort((a, b) => a - b);
    setAlgoArray(sorted);
    setAlgoStep((prev) => prev + 1);
  };

  const handleResetAlgo = () => {
    setAlgoArray([38, 12, 74, 25, 90, 45, 61]);
    setAlgoStep(0);
  };

  const handleTestApi = () => {
    setIsApiLoading(true);
    const start = performance.now();
    setTimeout(() => {
      const end = performance.now();
      setApiLatency(Math.round(end - start + Math.random() * 25));
      setIsApiLoading(false);
    }, 180);
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
          <div className="editorial-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-3">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">spaCy NLP & Anomaly Scoring Simulator</span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-white/50">Python FastAPI Microservice</span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-700 dark:text-white/70">Test Prompt / Query:</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Enter candidate skill query or security prompt..."
                />
                <button
                  onClick={handleRunAi}
                  disabled={isAiLoading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold transition-all disabled:opacity-50 shadow-md"
                >
                  {isAiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>RUN NLP MODEL</span>
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-slate-500 dark:text-white/50">Presets:</span>
              <button
                onClick={() => setAiPrompt('How do you calculate candidate match score?')}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono text-slate-700 dark:text-white/70 hover:text-indigo-600 dark:hover:text-indigo-300"
              >
                Candidate Match Score
              </button>
              <button
                onClick={() => setAiPrompt('Check session risk score for rapid logins')}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono text-slate-700 dark:text-white/70 hover:text-indigo-600 dark:hover:text-indigo-300"
              >
                Security Threat Risk
              </button>
            </div>

            {/* Simulated Response Box */}
            <div className="p-4 rounded-xl bg-slate-900 dark:bg-zinc-950 border border-slate-800 font-mono text-xs text-zinc-300 min-h-[90px] flex items-center shadow-inner">
              {isAiLoading ? (
                <div className="flex items-center gap-2 text-indigo-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Parsing tokens with Python microservice...</span>
                </div>
              ) : aiResponse ? (
                <div className="text-emerald-400 leading-relaxed">{aiResponse}</div>
              ) : (
                <span className="text-zinc-500">Click "RUN NLP MODEL" to execute simulated inference...</span>
              )}
            </div>
          </div>
        )}

        {/* Experiment Tab 2: Algo Step Visualizer */}
        {activeTab === 'algo' && (
          <div className="editorial-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-3">
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">Java Algorithmic Complexity Demo</span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-white/50">Sorting & Arrays</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-700 dark:text-white/70">Target Array State:</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleStepAlgo}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>SORT STEP</span>
                  </button>
                  <button
                    onClick={handleResetAlgo}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white text-xs font-mono"
                  >
                    RESET
                  </button>
                </div>
              </div>

              {/* Bar Visualizer */}
              <div className="h-40 p-4 rounded-xl bg-slate-900 dark:bg-zinc-950 border border-slate-800 flex items-end justify-center gap-3">
                {algoArray.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400">{val}</span>
                    <div 
                      className="w-8 rounded-t-md bg-gradient-to-t from-amber-600 to-indigo-500 transition-all duration-500"
                      style={{ height: `${val * 1.3}px` }}
                    />
                  </div>
                ))}
              </div>

              <div className="text-xs font-mono text-slate-600 dark:text-white/50 flex items-center justify-between">
                <span>Step Count: {algoStep}</span>
                <span>O(N log N) QuickSort Benchmark</span>
              </div>
            </div>
          </div>
        )}

        {/* Experiment Tab 3: API Speed Benchmark */}
        {activeTab === 'api' && (
          <div className="editorial-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-3">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Node.js / Express REST API Latency Inspector</span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-white/50">HTTP GET /api/health</span>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-700 dark:text-white/70">
                Measure response roundtrip latency for structured JSON payload resolution across server endpoints.
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleTestApi}
                  disabled={isApiLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold transition-all disabled:opacity-50 shadow-md"
                >
                  {isApiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  <span>BENCHMARK API</span>
                </button>

                {apiLatency !== null && !isApiLoading && (
                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Response Time: {apiLatency} ms (200 OK)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default PlaygroundSection;
