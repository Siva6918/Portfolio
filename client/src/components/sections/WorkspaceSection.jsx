import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp, ChevronDown, Play, FileText, FileType, Sheet,
  Link as LinkIcon, Image as ImageIcon, Grid3x3, X
} from 'lucide-react';
import { getWorkspaceItems } from '../../services/api';
import { useAnalytics } from '../../context/AnalyticsContext';

const easeCurve = [0.16, 1, 0.3, 1];

const RESOURCE_META = {
  video:    { label: 'Watch',         icon: Play,         color: '#f43f5e' },
  pdf:      { label: 'View PDF',      icon: FileText,     color: '#6366f1' },
  document: { label: 'Open Document', icon: FileType,     color: '#3b82f6' },
  excel:    { label: 'Open Excel',    icon: Sheet,        color: '#10b981' },
  image:    { label: 'View Image',    icon: ImageIcon,    color: '#f59e0b' },
  link:     { label: 'Visit Link',    icon: LinkIcon,     color: '#8b5cf6' },
};

const openResource = (item) => {
  if (item.resourceType === 'link' && item.externalUrl) {
    window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
  } else if (item.resource?.url) {
    window.open(item.resource.url, '_blank', 'noopener,noreferrer');
  }
};

// â”€â”€ Single Item Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const WorkspaceCard = ({ item, isActive, onClick }) => {
  const meta = RESOURCE_META[item.resourceType] || null;
  const Icon = meta?.icon;
  const color = meta?.color || '#38bdf8';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.92, y: isActive ? 0 : 8 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, ease: easeCurve }}
      onClick={onClick}
      className="relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 select-none"
      style={{
        background: "rgba(9,9,11,0.92)",
        borderColor: isActive ? color : "rgba(63,63,70,0.65)",
        boxShadow: isActive ? `0 12px 36px -6px ${color}35, 0 0 0 1px ${color}30` : "0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent 70%)` }} />

      {/* Cover Image - uncropped */}
      <div className="relative h-44 overflow-hidden bg-[#07070a] flex items-center justify-center p-2 border-b border-zinc-800/60">
        <img
          src={item.coverImage?.url}
          alt={item.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        {meta && (
          <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono"
            style={{ background: meta.color + '22', color: meta.color, border: `1px solid ${meta.color}44` }}>
            {Icon && <Icon className="w-3 h-3" />}
            {meta.label}
          </span>
        )}
      </div>

      {/* Content — no truncate / line-clamp so text is never cropped */}
      <div className="p-4 bg-transparent space-y-1.5">
        <h4 className="text-sm font-extrabold text-white leading-snug">{item.name}</h4>
        <p className="text-xs text-zinc-300 leading-relaxed">{item.description}</p>

        {isActive && meta && (
          <button
            onClick={(e) => { e.stopPropagation(); openResource(item); }}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all active:scale-[0.97]"
            style={{ background: meta.color + '18', color: meta.color, border: `1px solid ${meta.color}40`, boxShadow: `0 4px 16px ${meta.color}25` }}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />} {meta.label}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// â”€â”€ Vertical Carousel Column â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const WorkspaceCarousel = ({ items, title, accentColor, onExploreAll }) => {
  const [current, setCurrent] = useState(0);
  const touchStartY = useRef(null);

  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);
  const next = useCallback(() => setCurrent(c => Math.min(c + 1, items.length - 1)), [items.length]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp') prev();
    if (e.key === 'ArrowDown') next();
  }, [prev, next]);

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (delta > 40) next();
    else if (delta < -40) prev();
    touchStartY.current = null;
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2" style={{ color: accentColor }}>
          {title}
        </h3>
        <div className="editorial-card p-8 text-center">
          <p className="text-xs font-mono text-slate-500 dark:text-white/40">No {title.toLowerCase()} items available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          <span style={{ color: accentColor }}>{title}</span>
          <span className="ml-2 text-xs font-mono text-slate-500 dark:text-white/40">({current + 1}/{items.length})</span>
        </h3>
        <button
          onClick={onExploreAll}
          className="flex items-center gap-1.5 text-xs font-mono font-bold transition-all hover:opacity-80"
          style={{ color: accentColor }}
        >
          <Grid3x3 className="w-3.5 h-3.5" /> Explore All
        </button>
      </div>

      {/* Carousel container */}
      <div
        className="relative outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={`${title} carousel. Item ${current + 1} of ${items.length}`}
      >
        {/* Up arrow */}
        <div className="flex justify-center mb-3">
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous item"
            className="p-2 rounded-xl border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={current !== 0 ? { borderColor: accentColor + '40', background: accentColor + '12', color: accentColor } : {}}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* Items stack â€” show current + hint of adjacent */}
        <div className="flex flex-col gap-2 relative">
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => {
              if (Math.abs(idx - current) > 1) return null;
              return (
                <WorkspaceCard
                  key={item._id}
                  item={item}
                  isActive={idx === current}
                  onClick={() => idx !== current && setCurrent(idx)}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Down arrow */}
        <div className="flex justify-center mt-3">
          <button
            onClick={next}
            disabled={current === items.length - 1}
            aria-label="Next item"
            className="p-2 rounded-xl border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={current !== items.length - 1 ? { borderColor: accentColor + '40', background: accentColor + '12', color: accentColor } : {}}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Dot indicators */}
        {items.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {items.map((_, idx) => (
              <button key={idx} onClick={() => setCurrent(idx)} aria-label={`Go to item ${idx + 1}`}
                className="rounded-full transition-all duration-300"
                style={{ width: idx === current ? 16 : 6, height: 6, background: idx === current ? accentColor : '#71717a' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// â”€â”€ Explore All Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ExploreAllModal = ({ items, title, accentColor, onClose }) => {
  const [search, setSearch] = useState('');
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-800 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-800">
          <h3 className="text-lg font-extrabold" style={{ color: accentColor }}>{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-white/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {items.length > 5 && (
          <div className="px-6 py-3 border-b border-slate-200 dark:border-zinc-800">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search itemsâ€¦"
              className="w-full px-4 py-2 rounded-xl text-xs font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" />
          </div>
        )}
        <div className="overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-xs font-mono text-slate-500 dark:text-white/40 py-8">No items found.</p>
          )}
          {filtered.map(item => {
            const meta = RESOURCE_META[item.resourceType];
            const Icon = meta?.icon;
            return (
              <div key={item._id} className="rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
                <div className="relative h-36 overflow-hidden">
                  <img src={item.coverImage?.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-white/60 mt-1 line-clamp-2">{item.description}</p>
                  {meta && (
                    <button onClick={() => openResource(item)}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono transition-all"
                      style={{ background: meta.color + '18', color: meta.color, border: `1px solid ${meta.color}40` }}>
                      {Icon && <Icon className="w-3 h-3" />} {meta.label}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// â”€â”€ Main Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const WorkspaceSection = () => {
  const { trackInteraction } = useAnalytics();
  const [workItems, setWorkItems] = useState([]);
  const [personalItems, setPersonalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [exploreModal, setExploreModal] = useState(null); // 'work' | 'personal' | null

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setError(false);
        const res = await getWorkspaceItems();
        const all = (res.data?.data || []).filter(i => i.isVisible);
        setWorkItems(all.filter(i => i.category === 'work'));
        setPersonalItems(all.filter(i => i.category === 'personal'));
      } catch (err) {
        console.error('Failed to fetch workspace items:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const hasAny = workItems.length > 0 || personalItems.length > 0;

  // Only hide section when fetch succeeded and genuinely has zero items
  if (!loading && !error && !hasAny) return null;

  return (
    <section id="workspace" className="py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: easeCurve }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono tracking-widest text-emerald-600 dark:text-emerald-400 uppercase font-semibold mb-2"
            >
              12 // WORKSPACE
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">Work Space &{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400">Personal Space</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
            className="text-xs font-mono text-zinc-400 max-w-xs">Curated collections of work and personal resources, projects, and tools.
          </motion.p>
        </div>

        {error ? (
          <div className="p-10 text-center rounded-2xl border" style={{background:"rgba(9,9,11,0.85)",borderColor:"rgba(63,63,70,0.65)"}}>
            <p className="text-xs font-mono text-slate-500 dark:text-white/50">
              Workspace is temporarily unavailable â€” please check back soon.
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {[0, 1].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-32 rounded-xl animate-pulse" style={{background:"rgba(63,63,70,0.5)"}} />
                <div className="h-64 rounded-2xl animate-pulse" style={{background:"rgba(24,24,27,0.8)"}} />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            <WorkspaceCarousel
              items={workItems}
              title="Work Space"
              accentColor="#4ade80"
              onExploreAll={() => { trackInteraction('workspace_explore_work', 'Work Space', 'Workspace'); setExploreModal('work'); }}
            />
            <WorkspaceCarousel
              items={personalItems}
              title="Personal Space"
              accentColor="#2dd4bf"
              onExploreAll={() => { trackInteraction('workspace_explore_personal', 'Personal Space', 'Workspace'); setExploreModal('personal'); }}
            />
          </motion.div>
        )}
      </div>

      {/* Explore All Modal */}
      <AnimatePresence>
        {exploreModal === 'work' && (
          <ExploreAllModal items={workItems} title="All Work Space Items" accentColor="#4ade80" onClose={() => setExploreModal(null)} />
        )}
        {exploreModal === 'personal' && (
          <ExploreAllModal items={personalItems} title="All Personal Space Items" accentColor="#2dd4bf" onClose={() => setExploreModal(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default WorkspaceSection;


