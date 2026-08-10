import React from 'react';

const PortfolioBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Subtle Top Ambient Gradient Glow */}
      <div 
        className="absolute -top-[20vw] left-[15%] w-[70vw] h-[45vw] rounded-full opacity-[0.15] blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 80%)'
        }}
      />
      
      {/* Subtle Right Side Accent */}
      <div 
        className="absolute top-[40vh] -right-[15vw] w-[50vw] h-[50vw] rounded-full opacity-[0.08] blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(16, 185, 129, 0.1) 60%, transparent 80%)'
        }}
      />

      {/* Modern Ultra-Subtle Editorial Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />
    </div>
  );
};

export default PortfolioBackground;
