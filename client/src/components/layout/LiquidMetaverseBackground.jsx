import React, { useEffect, useRef } from 'react';

const LiquidMetaverseBackground = () => {
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

    // Liquid Metaballs with organic morphing physics
    // Colors matching user ratio: Charcoal 60%, Off-white 20%, Purple 10%, Magenta 5%, Sky blue 5%
    const metaballs = [
      { x: width * 0.2, y: height * 0.3, radius: 240, vx: 0.25, vy: 0.18, color: 'rgba(139, 92, 246, 0.35)', phase: 0 },    // Purple (10%)
      { x: width * 0.75, y: height * 0.6, radius: 280, vx: -0.2, vy: 0.22, color: 'rgba(168, 85, 247, 0.3)', phase: 1.2 },   // Violet Purple (10%)
      { x: width * 0.5, y: height * 0.8, radius: 220, vx: 0.3, vy: -0.25, color: 'rgba(236, 72, 153, 0.25)', phase: 2.4 },   // Magenta (5%)
      { x: width * 0.85, y: height * 0.25, radius: 200, vx: -0.15, vy: -0.2, color: 'rgba(125, 211, 252, 0.25)', phase: 3.6 },// Sky Blue (5%)
      { x: width * 0.3, y: height * 0.7, radius: 260, vx: -0.22, vy: 0.15, color: 'rgba(250, 250, 250, 0.18)', phase: 4.8 },  // Off-white (20%)
      { x: width * 0.1, y: height * 0.5, radius: 210, vx: 0.18, vy: -0.18, color: 'rgba(139, 92, 246, 0.25)', phase: 5.5 }   // Purple (10%)
    ];

    // Fluid particles simulating organic liquid flow
    const particleCount = 40;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 3 + 1.5,
      alpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.6 ? '#8b5cf6' : Math.random() > 0.4 ? '#ec4899' : '#7dd3fc'
    }));

    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Organic Morphing Liquid Blobs / Metaballs
      for (let i = 0; i < metaballs.length; i++) {
        const ball = metaballs[i];
        ball.x += ball.vx + Math.sin(time + ball.phase) * 0.6;
        ball.y += ball.vy + Math.cos(time + ball.phase) * 0.6;

        if (ball.x < -100 || ball.x > width + 100) ball.vx *= -1;
        if (ball.y < -100 || ball.y > height + 100) ball.vy *= -1;

        // Organic morphing radius
        const currentRadius = ball.radius + Math.sin(time * 1.5 + ball.phase) * 35;

        // Radial Liquid Gradient
        const grad = ctx.createRadialGradient(
          ball.x, ball.y, 10,
          ball.x, ball.y, Math.max(50, currentRadius)
        );
        grad.addColorStop(0, ball.color);
        grad.addColorStop(0.6, ball.color.replace(/[\d\.]+\)$/, '0.08)'));
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, Math.max(50, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // 2. Draw Fluid Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(time * 2 + p.phase) * 0.4;
        p.y += p.vy + Math.cos(time * 2 + p.phase) * 0.4;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const pRadius = p.radius + Math.sin(time * 3 + p.phase) * 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, pRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
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
      {/* 60% Deep Charcoal Ambient Background */}
      <div className="absolute inset-0 bg-[#09090b]"></div>

      {/* Chrome Soft Gradient Liquid Flares */}
      <div className="absolute -top-32 left-1/4 w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-[#8b5cf6]/20 via-[#ec4899]/15 to-[#7dd3fc]/15 blur-[160px] animate-pulse"></div>
      <div className="absolute bottom-[-10rem] right-1/4 w-[45rem] h-[45rem] rounded-full bg-gradient-to-tr from-[#18181b] via-[#8b5cf6]/20 to-[#fafafa]/10 blur-[180px]"></div>

      {/* Liquid Canvas Simulation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />
    </div>
  );
};

export default LiquidMetaverseBackground;
