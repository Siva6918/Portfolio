import React, { useEffect, useState } from 'react';

const Preloader = ({ onComplete }) => {
  const [loadingText, setLoadingText] = useState('Initializing Space...');

  useEffect(() => {
    const timer1 = setTimeout(() => setLoadingText('Loading Arsenal...'), 800);
    const timer2 = setTimeout(() => setLoadingText('Compiling Projects...'), 1600);
    const timer3 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-editorial-bg flex flex-col items-center justify-center transition-opacity duration-500">
      
      {/* Cartoon Laptop Typing Animation SVG */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          
          {/* Desk */}
          <rect x="20" y="150" width="160" height="6" fill="#333" rx="3" />
          
          {/* Laptop Base */}
          <rect x="50" y="140" width="100" height="10" fill="#a0aec0" rx="3" />
          {/* Laptop Screen */}
          <rect x="65" y="90" width="70" height="50" fill="#cbd5e1" rx="4" />
          {/* Laptop Inner Screen */}
          <rect x="70" y="95" width="60" height="40" fill="#1e293b" rx="2" />
          {/* Screen Glare/Code lines */}
          <rect x="75" y="100" width="20" height="2" fill="#38bdf8" className="animate-pulse" />
          <rect x="75" y="106" width="40" height="2" fill="#fb7185" className="animate-pulse delay-75" />
          <rect x="75" y="112" width="30" height="2" fill="#34d399" className="animate-pulse delay-150" />

          {/* Cartoon Character Body */}
          <path d="M70,160 Q100,100 130,160 Z" fill="#6366f1" />
          
          {/* Cartoon Character Head */}
          <circle cx="100" cy="85" r="20" fill="#fcd34d" className="animate-bounce" style={{ animationDuration: '0.8s' }} />
          
          {/* Hands Typing */}
          <circle cx="85" cy="135" r="6" fill="#fcd34d">
            <animate attributeName="cy" values="135;130;135" dur="0.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="115" cy="135" r="6" fill="#fcd34d">
            <animate attributeName="cy" values="135;130;135" dur="0.25s" repeatCount="indefinite" />
          </circle>
          
        </svg>
      </div>

      <h2 className="text-xl font-mono text-editorial-textMain font-bold tracking-widest animate-pulse">
        {loadingText}
      </h2>
      
      {/* Progress Bar */}
      <div className="w-48 h-1 bg-editorial-border rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-editorial-accent rounded-full animate-lineReveal transition-all duration-[2.5s] ease-out w-full" style={{ animation: 'lineReveal 2.5s ease-out forwards' }}></div>
      </div>
    </div>
  );
};

export default Preloader;
