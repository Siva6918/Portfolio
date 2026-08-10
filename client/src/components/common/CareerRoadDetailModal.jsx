import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CareerRoadDetailModal = ({ isOpen, onClose, nodes = [] }) => {
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const filteredNodes = nodes.filter((n) => {
    if (filter === 'all') return true;
    return n.status === filter;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl space-y-6 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4 shrink-0">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Full Career Progression Timeline</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Roadmap Details & Milestones
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-zinc-950 p-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 shrink-0 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 pl-2">
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filter Status:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: 'All Milestones' },
                { id: 'completed', label: 'Done' },
                { id: 'active', label: 'Active' },
                { id: 'future', label: 'Upcoming' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    filter === t.id
                      ? 'bg-indigo-600 text-white font-bold shadow-md'
                      : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid / Timeline Cards list */}
          <div className="overflow-y-auto pr-1 space-y-4 flex-1 font-sans">
            {filteredNodes.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                No milestones found for status filter "{filter}".
              </div>
            ) : (
              filteredNodes.map((node) => {
                const IconComp = node.icon || Clock;
                const isDone = node.status === 'completed';
                const isActive = node.status === 'active';

                return (
                  <div
                    key={node.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-indigo-500/40"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl text-white shrink-0 ${
                        isDone ? 'bg-indigo-600' : isActive ? 'bg-emerald-500' : 'bg-slate-700 dark:bg-zinc-800 text-slate-400'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                            {node.year}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="font-semibold text-slate-500 dark:text-zinc-400">
                            {node.subtitle}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {node.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                          {node.desc || node.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                        isDone
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                          : isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        <span className="capitalize">{node.status}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Bar */}
          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-md"
            >
              Close Roadmap Detail
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CareerRoadDetailModal;
