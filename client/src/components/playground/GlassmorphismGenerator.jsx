import React, { useState } from 'react';
import { Layers, Copy, Check } from 'lucide-react';

const GlassmorphismGenerator = () => {
  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(0.2);
  const [outline, setOutline] = useState(0.1);
  const [copied, setCopied] = useState(false);

  const cssCode = `background: rgba(255, 255, 255, ${transparency});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255, 255, 255, ${outline});
border-radius: 16px;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-[#0c0c12]/50 p-6 md:p-8 flex flex-col md:flex-row gap-8 min-h-[450px]">
      
      {/* Controls */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-zinc-800 pb-4">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white font-grotesk">Glassmorphism UI</h3>
            <p className="text-xs text-slate-500 font-mono">Real-time CSS generator</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              <label>Blur Value</label>
              <span className="text-indigo-500">{blur}px</span>
            </div>
            <input 
              type="range" 
              min="0" max="40" 
              value={blur} 
              onChange={(e) => setBlur(e.target.value)}
              className="w-full accent-indigo-500 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              <label>Transparency</label>
              <span className="text-indigo-500">{transparency}</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.05"
              value={transparency} 
              onChange={(e) => setTransparency(e.target.value)}
              className="w-full accent-indigo-500 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              <label>Outline / Border</label>
              <span className="text-indigo-500">{outline}</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.05"
              value={outline} 
              onChange={(e) => setOutline(e.target.value)}
              className="w-full accent-indigo-500 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-auto relative group">
          <button 
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
          </button>
          <pre className="bg-[#111116] p-4 rounded-xl text-[10px] sm:text-xs font-mono text-indigo-300 overflow-x-auto border border-zinc-800 leading-loose">
            {cssCode}
          </pre>
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-full md:w-1/2 rounded-2xl relative overflow-hidden flex items-center justify-center p-8 border border-slate-200 dark:border-zinc-800/50 bg-[#0a0a0a]">
        
        {/* Colorful Abstract Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-rose-500 rounded-full mix-blend-screen filter blur-[40px] opacity-60 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-indigo-500 rounded-full mix-blend-screen filter blur-[50px] opacity-60"></div>
          <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-emerald-500 rounded-full mix-blend-screen filter blur-[60px] opacity-50"></div>
        </div>

        {/* Glassmorphism Object */}
        <div 
          className="relative z-10 w-full max-w-sm aspect-video flex flex-col items-center justify-center shadow-2xl transition-all duration-300"
          style={{
            background: `rgba(255, 255, 255, ${transparency})`,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            border: `1px solid rgba(255, 255, 255, ${outline})`,
            borderRadius: '16px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
          }}
        >
          <h4 className="text-xl font-bold text-white tracking-widest font-grotesk">GLASS UI</h4>
          <p className="text-xs font-mono text-white/80 mt-2">Preview Panel</p>
        </div>

      </div>
    </div>
  );
};

export default GlassmorphismGenerator;
