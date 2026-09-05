import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp, ChevronDown, Play, FileText, FileType, Sheet,
  Link as LinkIcon, Image as ImageIcon, Grid3x3, X, ExternalLink
} from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { getWorkspaceItems } from '../../services/api';
import { useAnalytics } from '../../context/AnalyticsContext';

const easeCurve = [0.16, 1, 0.3, 1];

const RESOURCE_META = {
  video:    { label: 'Watch Demo',    icon: Play,         color: '#f43f5e' },
  pdf:      { label: 'View PDF',      icon: FileText,     color: '#6366f1' },
  document: { label: 'Open Document', icon: FileType,     color: '#3b82f6' },
  excel:    { label: 'Open Excel',    icon: Sheet,        color: '#10b981' },
  image:    { label: 'View Image',    icon: ImageIcon,    color: '#f59e0b' },
  link:     { label: 'Visit Link',    icon: LinkIcon,     color: '#8b5cf6' },
};

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const getItemSlug = (item) => {
  return item.slug || slugify(item.name) || item._id;
};

// ── Single Active Workspace Card ─────────────────────────────────────────────
const WorkspaceCard = ({ item, onNavigate }) => {
  const meta = RESOURCE_META[item.resourceType] || { label: 'Explore', icon: FileText, color: '#38bdf8' };
  const Icon = meta.icon;
  const color = meta.color;
  const slug = getItemSlug(item);
  const targetPath = `/workspace/${item.category}/${slug}`;

  const handleClick = (e) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate(targetPath);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(e); }}
      className="relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 select-none w-full group focus:outline-none focus:ring-2"
      style={{
        background: "rgba(9,9,11,0.94)",
        borderColor: color,
        boxShadow: `0 12px 32px -6px ${color}30, 0 0 0 1px ${color}25`,
      }}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent 75%)` }} />

      {/* Cover Image - Fitted to card with ambient backdrop */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-[#07070a] border-b border-zinc-800/70 flex items-center justify-center">
        {/* Ambient blurred backdrop so the container matches the image colors */}
        <img
          src={item.coverImage?.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
        />

        {/* Foreground uncropped fitted image */}
        <img
          src={item.coverImage?.url}
          alt={item.name}
          className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        {/* Resource Badge */}
        <span
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono shadow-md backdrop-blur-md"
          style={{ background: meta.color + '28', color: meta.color, border: `1px solid ${meta.color}55` }}
        >
          {Icon && <Icon className="w-3 h-3" />}
          {meta.label}
        </span>
      </div>

      {/* Card Content & Action Button */}
      <div className="p-4 sm:p-5 bg-transparent space-y-2">
        <h4 className="text-base font-extrabold text-white leading-snug group-hover:text-white transition-colors"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {item.name}
        </h4>
        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Primary Portfolio Navigation Button */}
        <button
          type="button"
          onClick={handleClick}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all active:scale-[0.98] shadow-md"
          style={{
            background: meta.color + '20',
            color: meta.color,
            border: `1px solid ${meta.color}45`,
            boxShadow: `0 4px 14px ${meta.color}20`
          }}
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span>{meta.label}</span>
        </button>
      </div>
    </div>
  );
};

// ── Responsive Vertical Carousel (EXACTLY ONE ACTIVE CARD AT A TIME) ─────────
const WorkspaceCarousel = ({ items, title, accentColor, onExploreAll }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const touchStartY = useRef(null);

  // Keep current in bounds if items change
  useEffect(() => {
    if (current >= items.length && items.length > 0) {
      setCurrent(items.length - 1);
    }
  }, [items.length, current]);

  const prev = useCallback(() => {
    setCurrent(c => (c > 0 ? c - 1 : c));
  }, []);

  const next = useCallback(() => {
    setCurrent(c => (c < items.length - 1 ? c + 1 : c));
  }, [items.length]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      next();
    }
  }, [prev, next]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    // Deliberate vertical swipe threshold
    if (delta > 45) {
      next();
    } else if (delta < -45) {
      prev();
    }
    touchStartY.current = null;
  };

  // 1. Zero Items: Compact Empty State
  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2" style={{ color: accentColor }}>
            {title}
          </h3>
        </div>
        <div className="editorial-card p-6 sm:p-8 text-center rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60">
          <p className="text-xs font-mono text-slate-500 dark:text-zinc-400">
            No {title.toLowerCase()} items available yet.
          </p>
        </div>
      </div>
    );
  }

  const activeItem = items[current] || items[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Category Header with Title, Counter, and Explore All */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span style={{ color: accentColor }}>{title}</span>
          {items.length > 1 && (
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
              ({current + 1}/{items.length})
            </span>
          )}
        </h3>

        <button
          onClick={onExploreAll}
          className="flex items-center gap-1.5 text-xs font-mono font-bold transition-all hover:opacity-80 active:scale-95"
          style={{ color: accentColor }}
        >
          <Grid3x3 className="w-3.5 h-3.5" /> Explore All
        </button>
      </div>

      {/* Carousel Container */}
      <div
        className="relative outline-none w-full"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={`${title} carousel. Item ${current + 1} of ${items.length}`}
      >
        {/* Up arrow — ONLY shown when multiple items exist */}
        {items.length > 1 && (
          <div className="flex justify-center mb-2">
            <button
              onClick={prev}
              disabled={current === 0}
              aria-label="Previous item"
              className="p-1.5 rounded-xl border transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={current !== 0 ? { borderColor: accentColor + '40', background: accentColor + '15', color: accentColor } : { borderColor: 'rgba(63,63,70,0.3)', color: '#71717a' }}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Card Viewport — EXACTLY ONE ACTIVE CARD, stable container height */}
        <div className="relative min-h-[330px] sm:min-h-[350px] w-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeItem && (
              <motion.div
                key={activeItem._id}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.3, ease: easeCurve }}
                className="w-full"
              >
                <WorkspaceCard
                  item={activeItem}
                  onNavigate={(path) => navigate(path)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Down arrow — ONLY shown when multiple items exist */}
        {items.length > 1 && (
          <div className="flex justify-center mt-2">
            <button
              onClick={next}
              disabled={current === items.length - 1}
              aria-label="Next item"
              className="p-1.5 rounded-xl border transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={current !== items.length - 1 ? { borderColor: accentColor + '40', background: accentColor + '15', color: accentColor } : { borderColor: 'rgba(63,63,70,0.3)', color: '#71717a' }}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dot indicators — ONLY shown when multiple items exist */}
        {items.length > 1 && (
          <div className="flex justify-center items-center gap-1.5 mt-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to item ${idx + 1}`}
                className="rounded-full transition-all duration-300 focus:outline-none"
                style={{
                  width: idx === current ? 18 : 6,
                  height: 6,
                  background: idx === current ? accentColor : '#71717a',
                  opacity: idx === current ? 1 : 0.5
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Explore All Modal (Links directly to Internal Resource Viewer) ───────────
const ExploreAllModal = ({ items, title, accentColor, onClose }) => {
  const navigate = useNavigate();
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

  const handleOpenItem = (item) => {
    onClose();
    const slug = getItemSlug(item);
    navigate(`/workspace/${item.category}/${slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-950 rounded-3xl border border-slate-200 dark:border-zinc-800 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800">
          <h3 className="text-lg font-extrabold" style={{ color: accentColor }}>{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {items.length > 4 && (
          <div className="px-6 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search items…"
              className="w-full px-4 py-2 rounded-xl text-xs font-mono bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        <div className="overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-xs font-mono text-slate-500 dark:text-zinc-400 py-8">
              No items found.
            </p>
          )}
          {filtered.map(item => {
            const meta = RESOURCE_META[item.resourceType] || { label: 'Explore', icon: FileText, color: '#38bdf8' };
            const Icon = meta.icon;
            return (
              <div
                key={item._id}
                onClick={() => handleOpenItem(item)}
                className="rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900 cursor-pointer hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex flex-col"
              >
                <div className="relative w-full h-40 overflow-hidden bg-[#07070a] border-b border-slate-200 dark:border-zinc-800/60 flex items-center justify-center">
                  <img
                    src={item.coverImage?.url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                  />
                  <img
                    src={item.coverImage?.url}
                    alt={item.name}
                    className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain p-1"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <span
                    className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold backdrop-blur-md"
                    style={{ background: meta.color + '25', color: meta.color, border: `1px solid ${meta.color}45` }}
                  >
                    {meta.label}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleOpenItem(item); }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all"
                    style={{ background: meta.color + '18', color: meta.color, border: `1px solid ${meta.color}40` }}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>Open in Portfolio</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Main Workspace Section ───────────────────────────────────────────────────
const WorkspaceSection = () => {
  const { trackInteraction } = useAnalytics();
  const [workItems, setWorkItems] = useState([]);
  const [personalItems, setPersonalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [exploreModal, setExploreModal] = useState(null); // 'work' | 'personal' | null

  useEffect(() => {
    let isMounted = true;
    const fetchItems = async () => {
      try {
        setError(false);
        const res = await getWorkspaceItems();
        const all = (res.data?.data || []).filter(i => i.isVisible);
        if (isMounted) {
          setWorkItems(all.filter(i => i.category === 'work'));
          setPersonalItems(all.filter(i => i.category === 'personal'));
        }
      } catch (err) {
        console.error('Failed to fetch workspace items:', err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchItems();
    return () => { isMounted = false; };
  }, []);

  const hasAny = workItems.length > 0 || personalItems.length > 0;

  // Only hide section when fetch succeeded and genuinely has zero items
  if (!loading && !error && !hasAny) return null;

  return (
    <section id="workspace" className="py-20 sm:py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
      <div className="section-container">
        {/* Header with Color-Sparked Card Pill & Space Grotesk */}
        <SectionHeader
          badgeText="08 // WORKSPACE & GEAR"
          icon={Grid3x3}
          color="#10b981"
          title="Work Space & "
          gradientTitle="Personal Space"
          description="Curated collections of work and personal resources, projects, and tools."
        />

        {error ? (
          <div className="p-8 text-center rounded-2xl border" style={{ background: "rgba(9,9,11,0.85)", borderColor: "rgba(63,63,70,0.65)" }}>
            <p className="text-xs font-mono text-slate-500 dark:text-white/50">
              Workspace is temporarily unavailable — please check back soon.
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {[0, 1].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-32 rounded-xl animate-pulse" style={{ background: "rgba(63,63,70,0.5)" }} />
                <div className="h-64 rounded-2xl animate-pulse" style={{ background: "rgba(24,24,27,0.8)" }} />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
          >
            <WorkspaceCarousel
              items={workItems}
              title="Work Space"
              accentColor="#4ade80"
              onExploreAll={() => {
                trackInteraction('workspace_explore_work', 'Work Space', 'Workspace');
                setExploreModal('work');
              }}
            />
            <WorkspaceCarousel
              items={personalItems}
              title="Personal Space"
              accentColor="#2dd4bf"
              onExploreAll={() => {
                trackInteraction('workspace_explore_personal', 'Personal Space', 'Workspace');
                setExploreModal('personal');
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Explore All Modal */}
      <AnimatePresence>
        {exploreModal === 'work' && (
          <ExploreAllModal
            items={workItems}
            title="All Work Space Items"
            accentColor="#4ade80"
            onClose={() => setExploreModal(null)}
          />
        )}
        {exploreModal === 'personal' && (
          <ExploreAllModal
            items={personalItems}
            title="All Personal Space Items"
            accentColor="#2dd4bf"
            onClose={() => setExploreModal(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default WorkspaceSection;
