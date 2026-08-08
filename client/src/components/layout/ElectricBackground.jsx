import React, { useEffect, useRef } from 'react';

const ElectricBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create Cybernetic Tech Nodes / Metaverse Data Streams (No Grid Boxes, No Dots)
    const particleCount = Math.min(60, Math.floor(width / 25));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? '#8b5cf6' : Math.random() > 0.5 ? '#a855f7' : '#7dd3fc',
      pulse: Math.random() * Math.PI
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle nodes & connecting technology data lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        p1.pulse += 0.02;
        const currentRadius = p1.radius + Math.sin(p1.pulse) * 0.5;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p1.color;
        ctx.fill();

        // Connect nearby nodes with technology data lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 140) * 0.18;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#09090b]">
      {/* Metaverse Deep Space Ambient Purple/Violet Nebulae (No Boxes) */}
      <div className="absolute -top-40 -left-40 w-[45rem] h-[45rem] rounded-full bg-[#8b5cf6]/18 blur-[160px] animate-pulse"></div>
      <div className="absolute top-1/3 -right-40 w-[40rem] h-[40rem] rounded-full bg-[#a855f7]/18 blur-[160px]"></div>
      <div className="absolute top-2/3 -left-40 w-[42rem] h-[42rem] rounded-full bg-[#8b5cf6]/15 blur-[170px]"></div>
      <div className="absolute -bottom-40 right-1/4 w-[45rem] h-[45rem] rounded-full bg-[#ec4899]/12 blur-[180px]"></div>

      {/* Interactive Tech Nodes Canvas (No Grid Boxes, No Dots) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
    </div>
  );
};

export default ElectricBackground;
