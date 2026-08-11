import React, { useState, useCallback } from 'react';
import { Zap, RefreshCw, RotateCcw, Activity, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { buildApiUrl } from '../../services/api';

const HEALTH_ENDPOINT = buildApiUrl('/health');

const ApiBenchmarkVisualizer = ({ className = '' }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentRequestNum, setCurrentRequestNum] = useState(0);
  const [requestsHistory, setRequestsHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const runBenchmark = useCallback(async () => {
    setIsRunning(true);
    setRequestsHistory([]);
    setErrorMsg(null);
    setCurrentRequestNum(0);

    const history = [];

    for (let i = 1; i <= 10; i++) {
      setCurrentRequestNum(i);
      const startTime = performance.now();
      let status = 0;
      let statusText = '';
      let isSuccess = false;
      let latency = 0;

      try {
        // Real HTTP GET Request to /api/health with cache-busting timestamp
        const res = await fetch(`${HEALTH_ENDPOINT}?t=${Date.now()}_${i}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        const endTime = performance.now();
        latency = Math.round(endTime - startTime);
        status = res.status;
        statusText = res.statusText || (res.ok ? 'OK' : 'Error');
        isSuccess = res.ok;
      } catch (err) {
        const endTime = performance.now();
        latency = Math.round(endTime - startTime);
        status = 0;
        statusText = err.name === 'AbortError' ? 'Timeout' : 'Network Error';
        isSuccess = false;
      }

      const reqRecord = {
        id: i,
        latency,
        status,
        statusText,
        success: isSuccess
      };

      history.push(reqRecord);
      setRequestsHistory([...history]);

      // Small pacing pause between requests for visual feedback clarity (30ms)
      await new Promise((r) => setTimeout(r, 30));
    }

    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCurrentRequestNum(0);
    setRequestsHistory([]);
    setErrorMsg(null);
  }, []);

  // Compute Benchmark Statistics
  const total = requestsHistory.length;
  const successfulCount = requestsHistory.filter((r) => r.success).length;
  const failedCount = total - successfulCount;
  const successRate = total > 0 ? Math.round((successfulCount / total) * 100) : 0;

  const latencies = requestsHistory.map((r) => r.latency);
  const avgLatency = total > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / total) : null;
  const minLatency = total > 0 ? Math.min(...latencies) : null;
  const maxLatency = total > 0 ? Math.max(...latencies) : null;

  const lastReq = total > 0 ? requestsHistory[total - 1] : null;

  // Latency rating helper
  const getLatencyRating = (ms) => {
    if (ms === null) return { label: 'Idle', color: 'text-slate-400', bg: 'bg-slate-800' };
    if (ms < 100) return { label: 'Fast', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (ms <= 300) return { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'Slow', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const rating = getLatencyRating(avgLatency);

  return (
    <div className={`editorial-card p-5 sm:p-8 space-y-6 flex flex-col justify-between min-h-[540px] sm:min-h-[480px] h-full ${className}`}>
      {/* Meta Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-4 gap-3">
        <div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider block">
            Node.js / Express REST API Latency Inspector
          </span>
          <span className="text-xs font-mono text-slate-500 dark:text-white/50">
            Real-time Sequential Latency Inspector & Benchmark
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>HTTP GET /api/health</span>
          </span>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-zinc-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={runBenchmark}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold transition-all disabled:opacity-50 shadow-md active:scale-95"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>BENCHMARKING... ({currentRequestNum}/10)</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>BENCHMARK API</span>
              </>
            )}
          </button>

          {total > 0 && (
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-mono text-xs transition-all shadow-sm disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          )}
        </div>

        {/* Live Rating Badge */}
        {avgLatency !== null && (
          <div className={`px-3 py-1 rounded-full border text-xs font-mono font-bold flex items-center gap-1.5 ${rating.bg} ${rating.color}`}>
            <Activity className="w-3.5 h-3.5" />
            <span>Latency Rating: {rating.label} ({avgLatency} ms avg)</span>
          </div>
        )}
      </div>

      {/* Benchmark Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        {/* Avg Latency */}
        <div className="p-4 rounded-xl bg-slate-900 dark:bg-zinc-950 border border-slate-800 flex flex-col justify-between space-y-1 shadow-inner">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Average</span>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">
            {avgLatency !== null ? `${avgLatency} ms` : '—'}
          </div>
          <span className="text-[10px] text-zinc-500">Mean round-trip time</span>
        </div>

        {/* Min / Max Latency */}
        <div className="p-4 rounded-xl bg-slate-900 dark:bg-zinc-950 border border-slate-800 flex flex-col justify-between space-y-1 shadow-inner">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Min / Max</span>
          <div className="text-sm font-extrabold text-amber-400 flex items-center gap-1">
            <span>{minLatency !== null ? `${minLatency} ms` : '—'}</span>
            <span className="text-zinc-600">/</span>
            <span>{maxLatency !== null ? `${maxLatency} ms` : '—'}</span>
          </div>
          <span className="text-[10px] text-zinc-500">Latency spread</span>
        </div>

        {/* Success Rate */}
        <div className="p-4 rounded-xl bg-slate-900 dark:bg-zinc-950 border border-slate-800 flex flex-col justify-between space-y-1 shadow-inner">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Success Rate</span>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-400">
            {total > 0 ? `${successRate}%` : '—'}
          </div>
          <span className="text-[10px] text-zinc-500">{successfulCount}/{total} successful</span>
        </div>

        {/* Last Status */}
        <div className="p-4 rounded-xl bg-slate-900 dark:bg-zinc-950 border border-slate-800 flex flex-col justify-between space-y-1 shadow-inner">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Last Status</span>
          <div className="text-sm font-extrabold text-teal-400 truncate">
            {lastReq ? `${lastReq.status || 'ERR'} ${lastReq.statusText}` : '—'}
          </div>
          <span className="text-[10px] text-zinc-500">HTTP Response</span>
        </div>
      </div>

      {/* Mini Request History Sparkline Bar Chart */}
      {total > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-zinc-300">
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Sequential Request Latency Variation (10 Samples):</span>
            </span>
            <span className="text-slate-500 dark:text-zinc-500 text-[11px]">
              {total} of 10 completed
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 dark:bg-zinc-950 border border-slate-800 space-y-3">
            <div className="h-32 flex items-end justify-between gap-1.5 sm:gap-3 px-2 pt-4">
              {Array.from({ length: 10 }).map((_, idx) => {
                const req = requestsHistory[idx];
                if (!req) {
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full h-2 rounded bg-zinc-800/60" />
                      <span className="text-[9px] font-mono text-zinc-600">#{idx + 1}</span>
                    </div>
                  );
                }

                // Compute bar height percentage relative to maxLatency (min height 15%)
                const maxVal = Math.max(...latencies, 50);
                const heightPercent = Math.max(Math.round((req.latency / maxVal) * 100), 15);

                let barColor = 'bg-emerald-500';
                if (!req.success) barColor = 'bg-rose-500';
                else if (req.latency > 300) barColor = 'bg-rose-500';
                else if (req.latency > 100) barColor = 'bg-amber-400';

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 bg-slate-950 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                      {req.latency} ms ({req.status})
                    </div>

                    <span className="text-[10px] font-mono text-zinc-400 font-bold">
                      {req.latency}ms
                    </span>

                    <div
                      className={`w-full rounded-t-md ${barColor} transition-all duration-300 shadow-md`}
                      style={{ height: `${heightPercent}%` }}
                    />

                    <span className="text-[9px] font-mono text-zinc-500">
                      #{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Summary Banner */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        {total === 0 ? (
          <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>Click <strong>"BENCHMARK API"</strong> to issue 10 sequential GET requests to <code>/api/health</code> and compute latency metrics.</span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-slate-800 dark:text-zinc-200 font-semibold">
              Benchmark Completed: <strong>Average: {avgLatency} ms</strong> · Min: <strong>{minLatency} ms</strong> · Max: <strong>{maxLatency} ms</strong> · <strong>{successfulCount}/{total} successful</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiBenchmarkVisualizer;
