import React from 'react';

const DigitalBuilding = ({ title, type = 'tower', xPercent, yPercent, width = 140, height = 170, opacity = 0.18 }) => {
  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none transition-all duration-500 block scale-75 sm:scale-90 lg:scale-100"
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        opacity
      }}
    >
      <div 
        className="relative flex flex-col justify-between p-3 border-t border-l border-r border-[#52525b] rounded-t-3xl bg-gradient-to-b from-[#121217]/60 to-transparent shadow-[0_0_20px_rgba(99,102,241,0.2)]"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {/* Architectural Arch / Glass Top Structure */}
        <div className="w-full flex justify-between items-center px-1">
          <div className="w-1.5 h-6 rounded-t bg-[#6366f1]/80"></div>
          <div className="w-full h-1 mx-2 bg-gradient-to-r from-[#6366f1] via-[#fafafa]/30 to-[#52525b] rounded-full"></div>
          <div className="w-1.5 h-6 rounded-t bg-[#6366f1]/80"></div>
        </div>
        
        {/* Signboard Floating Badge */}
        <div className="px-2.5 py-1 rounded-lg bg-[#09090b]/95 border border-[#52525b] text-[9px] font-mono text-[#fafafa] uppercase tracking-wider text-center font-bold">
          {title}
        </div>

        {/* Vertical Architectural Pillars Texture */}
        <div className="flex justify-between items-end h-12 px-2 opacity-50">
          <div className="w-1 h-full bg-[#52525b]"></div>
          <div className="w-1 h-full bg-[#6366f1]"></div>
          <div className="w-1 h-full bg-[#52525b]"></div>
          <div className="w-1 h-full bg-[#6366f1]"></div>
          <div className="w-1 h-full bg-[#52525b]"></div>
        </div>
      </div>
    </div>
  );
};

export default DigitalBuilding;
