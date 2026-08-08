import React from 'react';

const AmbientBackground = () => {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#09090b]">
      {/* Base Gradient: Obsidian (#09090B) to Cyber Charcoal (#121217) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.12), transparent 35%),
            radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.08), transparent 30%),
            linear-gradient(135deg, #09090b 0%, #121217 50%, #1a1a22 100%)
          `
        }}
      ></div>

      {/* Electric Ambient Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-[45rem] h-[45rem] rounded-full bg-[#6366f1]/[0.06] blur-[160px]"></div>
      <div className="absolute top-1/3 -right-40 w-[40rem] h-[40rem] rounded-full bg-[#06b6d4]/[0.05] blur-[160px]"></div>
      <div className="absolute -bottom-40 left-1/3 w-[45rem] h-[45rem] rounded-full bg-[#c084fc]/[0.04] blur-[180px]"></div>
    </div>
  );
};

export default AmbientBackground;
