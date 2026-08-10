import React, { useState, useCallback } from 'react';
import { Cpu, Play, RefreshCw, Sparkles, Tag, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';
import { buildApiUrl } from '../../services/api';

const NLP_QUERY_ENDPOINT = buildApiUrl('/nlp/query');

const NlpEngineVisualizer = () => {
  const [aiPrompt, setAiPrompt] = useState('How do you calculate candidate match score?');
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleRunAi = useCallback(async () => {
    if (!aiPrompt || !aiPrompt.trim()) {
      setErrorMsg('Please enter a query or question.');
      return;
    }

    setIsAiLoading(true);
    setAiResponse(null);
    setErrorMsg(null);

    try {
      const res = await fetch(NLP_QUERY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: aiPrompt.trim() })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAiResponse(data);
      } else {
        setErrorMsg(data.message || 'Failed to process AI NLP query.');
      }
    } catch (err) {
      setErrorMsg('Network error connecting to AI microservice backend.');
    } finally {
      setIsAiLoading(false);
    }
  }, [aiPrompt]);

  const applyPreset = useCallback((presetText) => {
    setAiPrompt(presetText);
    setErrorMsg(null);
  }, []);

  return (
    <div className="editorial-card p-5 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-4 gap-3">
        <div>
          <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider block">
            AI-Powered NLP & Question-Answering Engine
          </span>
          <span className="text-xs font-mono text-slate-500 dark:text-white/50">
            Express Microservice · Token Parsing & Generative AI Pipeline
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-mono font-semibold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>POST /api/nlp/query</span>
          </span>
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-3">
        <label className="block text-xs font-mono text-slate-700 dark:text-white/70">
          Ask Any Technical, Candidate, or Computer Science Question:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => {
              setAiPrompt(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isAiLoading) handleRunAi();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Type any question (e.g. What is React?, Explain binary search...)"
          />
          <button
            onClick={handleRunAi}
            disabled={isAiLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold transition-all disabled:opacity-50 shadow-md active:scale-95 shrink-0"
          >
            {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isAiLoading ? 'PARSING MODEL...' : 'RUN NLP MODEL'}</span>
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-mono text-slate-500 dark:text-white/50">Example Presets:</span>
        {[
          { label: 'Candidate Match Score', query: 'How do you calculate candidate match score for MERN experience?' },
          { label: 'Security Threat Risk', query: 'Check session risk score for rapid login anomaly' },
          { label: 'What is React?', query: 'What is React and how does the virtual DOM work?' },
          { label: 'Binary Search', query: 'Explain binary search algorithm and its time complexity' },
          { label: 'What is SQL Injection?', query: 'Explain SQL injection security vulnerability and prevention' }
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => applyPreset(preset.query)}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[10px] font-mono text-slate-700 dark:text-white/70 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-500/40 transition-all"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Error Alert Box */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* AI Response Output Box */}
      <div className="p-5 rounded-xl bg-slate-900 dark:bg-zinc-950 border border-slate-800 font-mono text-xs text-zinc-300 min-h-[120px] flex flex-col justify-between space-y-4 shadow-inner">
        {isAiLoading ? (
          <div className="flex items-center gap-3 text-indigo-400 py-6 justify-center">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <div className="flex flex-col">
              <span className="font-bold text-sm">Evaluating NLP Query Tokens...</span>
              <span className="text-[10px] text-zinc-500">Executing entity extraction & LLM inference pipeline</span>
            </div>
          </div>
        ) : aiResponse ? (
          <div className="space-y-4">
            {/* Answer Text */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generated AI Response:</span>
              </div>
              <p className="text-emerald-400 leading-relaxed text-sm font-sans pt-1">
                {aiResponse.answer}
              </p>
            </div>

            {/* NLP Analysis Breakdown */}
            {aiResponse.nlpAnalysis && (
              <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-[10px]">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Intent Tag */}
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">
                    Intent: {aiResponse.nlpAnalysis.intent}
                  </span>

                  {/* Extracted Entities */}
                  {aiResponse.nlpAnalysis.extractedEntities?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-zinc-500" />
                      {aiResponse.nlpAnalysis.extractedEntities.map((ent) => (
                        <span key={ent} className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300 border border-zinc-700">
                          {ent}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 text-zinc-400">
                  <span>Tokens: <strong className="text-zinc-200">{aiResponse.nlpAnalysis.tokensCount}</strong></span>
                  <span>Latency: <strong className="text-emerald-400">{aiResponse.nlpAnalysis.processingTimeMs} ms</strong></span>
                  <span className="text-zinc-500 font-mono text-[9px]">{aiResponse.nlpAnalysis.source}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-1 text-zinc-500">
            <Cpu className="w-6 h-6 text-zinc-700 mb-1" />
            <span>Type any question above or select an example preset, then click <strong>"RUN NLP MODEL"</strong>.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NlpEngineVisualizer;
