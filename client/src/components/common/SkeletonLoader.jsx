import React, { useState, useEffect, useRef } from 'react';
import { Flame, Crosshair, Zap, Sparkles, RefreshCw, Trophy, ArrowRight } from 'lucide-react';
import { 
  fallbackProfile, 
  fallbackProjects, 
  fallbackSkills, 
  fallbackExperience, 
  fallbackCertifications, 
  fallbackAchievements, 
  fallbackNotes 
} from '../../services/mockData';

const TIPS = [
  "Free Fire Strategy: Always glue-wall before looting the airdrop in open zones.",
  "Engineering Telemetry: Render's free cloud instance is waking up from idle sleep (~25s)...",
  "High APM Mindset: Fast keyboard reflexes translate directly into rapid debugging and refactoring.",
  "Siva's Arsenal: Full-Stack React, Node.js, Express, MongoDB, Tailwind CSS & AI Integrations.",
  "Booyah Philosophy: Stay composed in the final zone; maintain clean architecture under pressure.",
  "Pro Tip: Hit the 'Load Instant Data' button below if you want zero waiting time!"
];

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const [clicks, setClicks] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [apm, setApm] = useState(0);
  const [clickSparks, setClickSparks] = useState([]);
  const [appliedInstantData, setAppliedInstantData] = useState(false);
  const lastClickTimes = useRef([]);

  // Cycle tips every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Handle APM Clicker mini-game
  const handleApmClick = (e) => {
    const now = Date.now();
    lastClickTimes.current.push(now);
    // Keep only clicks within last 5 seconds
    lastClickTimes.current = lastClickTimes.current.filter(t => now - t <= 5000);
    
    // Estimate APM (clicks per 5s * 12)
    const currentApm = Math.max(120, Math.round(lastClickTimes.current.length * 12) + (clicks * 3));
    setApm(currentApm);
    setClicks(prev => prev + 1);

    // Audio policy safe click tick
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440 + Math.min(clicks * 20, 800), audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (err) {
      // Audio autoplay policy fallback
    }

    // Spawn visual spark
    const sparkId = Math.random();
    setClickSparks(prev => [...prev.slice(-6), sparkId]);
    setTimeout(() => {
      setClickSparks(prev => prev.filter(id => id !== sparkId));
    }, 600);
  };

  // Rank title based on clicks
  const getRank = () => {
    if (clicks >= 30) return { title: 'GRANDMASTER BOOYAH 👑', color: '#f43f5e', bg: 'rgba(244,63,94,0.15)', border: '#f43f5e' };
    if (clicks >= 18) return { title: 'HEROIC SNIPER 🔥', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: '#f59e0b' };
    if (clicks >= 8)  return { title: 'TACTICAL RUSHER ⚡', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: '#fbbf24' };
    return { title: 'SCOUT RECRUIT 🎯', color: '#e2e8f0', bg: 'rgba(226,232,240,0.1)', border: '#94a3b8' };
  };

  const rank = getRank();

  // Instant fallback injector
  const handleLoadInstantData = () => {
    setAppliedInstantData(true);
    localStorage.setItem('siva_profile', JSON.stringify(fallbackProfile));
    localStorage.setItem('siva_projects', JSON.stringify(fallbackProjects));
    localStorage.setItem('siva_skills', JSON.stringify(fallbackSkills));
    localStorage.setItem('siva_experience', JSON.stringify(fallbackExperience));
    localStorage.setItem('siva_certifications', JSON.stringify(fallbackCertifications));
    localStorage.setItem('siva_achievements', JSON.stringify(fallbackAchievements));
    localStorage.setItem('siva_notes', JSON.stringify(fallbackNotes));

    // Dispatch global event so active pages re-read localStorage and exit loading immediately
    window.dispatchEvent(new Event('portfolio_instant_data_ready'));
    window.dispatchEvent(new Event('storage'));
    
    // Refresh page if not resolved in 300ms
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className="w-full space-y-8 my-6">
      
      {/* ─── ENTERTAINING TACTICAL APM WARMUP CONSOLE ─── */}
      <div className="w-full bg-[#101016] border border-marigold/30 hover:border-marigold/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
        
        {/* Radar Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-marigold/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-neonRose/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#242834]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-marigold to-neonRose text-black shadow-md shadow-marigold/20">
              <Flame className="w-5 h-5 fill-black animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-marigold px-2 py-0.5 rounded-full bg-marigold/10 border border-marigold/30">
                  SERVER HANDSHAKE IN PROGRESS
                </span>
                <span className="w-2 h-2 rounded-full bg-neonRose animate-ping" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold font-grotesk text-white mt-1">
                Warm Up Your Reflexes While Data Syncs
              </h4>
            </div>
          </div>

          {/* Instant Skip Button */}
          <button
            onClick={handleLoadInstantData}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black transition-all shadow-md hover:scale-105 active:scale-95 shrink-0"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>{appliedInstantData ? 'DATA LOADED!' : 'SKIP WAIT // INSTANT DATA'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Middle Interactive APM Clicker Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-6">
          
          {/* APM Click Target */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#08080a] border border-[#242834] relative">
            <button
              onClick={handleApmClick}
              className="group relative w-36 h-36 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-150 active:scale-90 shadow-xl"
              style={{
                borderColor: rank.border,
                background: `radial-gradient(circle, ${rank.bg} 0%, rgba(8,8,10,0.9) 70%)`,
                boxShadow: `0 0 25px ${rank.border}40`
              }}
            >
              <Crosshair className="w-8 h-8 transition-transform group-hover:rotate-45 group-active:scale-125" style={{ color: rank.color }} />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider mt-1 text-white">
                TAP TO BOOST
              </span>
              <span className="text-[9px] font-mono text-zinc-400">
                CLUTCH APM
              </span>
              
              {/* Click pulse wave */}
              <span className="absolute inset-0 rounded-full border border-marigold/30 animate-ping pointer-events-none" />
            </button>

            {/* Click Count & Status Badge */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400">
                CLICKS: <strong className="text-white text-sm">{clicks}</strong>
              </span>
              <span className="text-xs font-mono text-zinc-400">|</span>
              <span className="text-xs font-mono text-zinc-400">
                EST. APM: <strong className="text-marigold text-sm">{apm || 280}</strong>
              </span>
            </div>

            {/* Current Rank Pill */}
            <div 
              className="mt-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border"
              style={{ color: rank.color, borderColor: rank.border, background: rank.bg }}
            >
              {rank.title}
            </div>
          </div>

          {/* Telemetry & Tips Panel */}
          <div className="flex flex-col justify-between space-y-4">
            
            {/* Live Progress Telemetry */}
            <div className="p-4 rounded-xl bg-[#08080a] border border-[#242834]">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-marigold animate-spin" />
                  RENDER CONTAINER TELEMETRY
                </span>
                <span className="text-marigold font-bold">SPINNING UP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#161622] overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(95, 25 + clicks * 3)}%`,
                    background: 'linear-gradient(to right, #f59e0b, #f43f5e)'
                  }} 
                />
              </div>
              <p className="text-[11px] font-mono text-zinc-500 mt-2">
                Clicking the target charges the connection pipe and activates instant offline cache.
              </p>
            </div>

            {/* Cycling Tactical Tip */}
            <div className="p-4 rounded-xl bg-marigold/5 border border-marigold/20 min-h-[85px] flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-marigold shrink-0" />
              <p className="text-xs sm:text-sm font-mono text-iceSilver transition-all duration-300">
                {TIPS[tipIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SHIMMERING SKELETON CARDS BELOW ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: count }).map((_, idx) => (
          <div 
            key={idx} 
            className="bg-[#101016] border border-[#242834] rounded-2xl p-6 space-y-4 relative overflow-hidden"
          >
            {/* Shimmer animation bar */}
            <div 
              className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.06), rgba(244,63,94,0.06), transparent)'
              }}
            />

            <div className="flex items-center justify-between">
              <div className="h-5 bg-[#181824] rounded-lg w-1/3" />
              <div className="h-5 bg-[#181824] rounded-full w-16" />
            </div>
            
            <div className="h-6 bg-[#181824] rounded-lg w-3/4" />
            
            <div className="space-y-2 pt-2">
              <div className="h-3.5 bg-[#181824] rounded w-full" />
              <div className="h-3.5 bg-[#181824] rounded w-5/6" />
              <div className="h-3.5 bg-[#181824] rounded w-2/3" />
            </div>

            <div className="pt-4 flex items-center gap-2 border-t border-[#242834]/60">
              <div className="h-6 bg-[#181824] rounded-md w-16" />
              <div className="h-6 bg-[#181824] rounded-md w-20" />
              <div className="h-6 bg-[#181824] rounded-md w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
