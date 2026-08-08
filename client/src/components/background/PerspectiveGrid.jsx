import React, { useEffect, useRef } from 'react';

const PerspectiveGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse Targets
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 3D Liquid Metaballs Simulation Objects
    const metaballCount = 6;
    const metaballs = [
      { x: width * 0.2, y: height * 0.3, radius: 140, vx: 0.6, vy: 0.4, color: 'rgba(99, 102, 241, 0.18)' },
      { x: width * 0.75, y: height * 0.4, radius: 170, vx: -0.5, vy: 0.5, color: 'rgba(6, 182, 212, 0.15)' },
      { x: width * 0.5, y: height * 0.7, radius: 190, vx: 0.4, vy: -0.6, color: 'rgba(192, 132, 252, 0.16)' },
      { x: width * 0.85, y: height * 0.8, radius: 130, vx: -0.6, vy: -0.3, color: 'rgba(99, 102, 241, 0.14)' },
      { x: width * 0.15, y: height * 0.75, radius: 150, vx: 0.5, vy: 0.4, color: 'rgba(6, 182, 212, 0.16)' },
      { x: width * 0.4, y: height * 0.2, radius: 120, vx: -0.4, vy: -0.5, color: 'rgba(16, 185, 129, 0.12)' }
    ];

    // Liquid Glass Particles (35 Droplets)
    const particleCount = width < 768 ? 20 : 40;
    const particles = Array.from({ length: particleCount }, () => {
      const rand = Math.random();
      let color = '#fafafa';
      if (rand > 0.6 && rand <= 0.8) color = '#a1a1aa';
      else if (rand > 0.8 && rand <= 0.92) color = '#06b6d4';
      else if (rand > 0.92) color = '#6366f1';

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.2 + 1.2,
        alpha: Math.random() * 0.55 + 0.25,
        pulseOffset: Math.random() * Math.PI * 2,
        color
      };
    });

    let time = 0;

    const render = () => {
      time += 0.012;

      // Mouse Lerp
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // 1. 3D LIQUID METABALLS SIMULATION (Fluid Blob Morphing with Viscosity & Glow)
      for (let i = 0; i < metaballCount; i++) {
        const ball = metaballs[i];
        if (!prefersReducedMotion) {
          ball.x += ball.vx + Math.sin(time * 0.8 + i) * 0.4;
          ball.y += ball.vy + Math.cos(time * 0.8 + i) * 0.4;
        }

        // Screen boundary bounce
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) ball.vx *= -1;
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > height) ball.vy *= -1;

        // Dynamic 3D Liquid Morph Gradient
        const morphX = ball.x + Math.sin(time + i) * 25;
        const morphY = ball.y + Math.cos(time + i) * 25;

        const liquidGrad = ctx.createRadialGradient(
          morphX, morphY, 10,
          ball.x, ball.y, ball.radius
        );
        liquidGrad.addColorStop(0, ball.color);
        liquidGrad.addColorStop(0.6, ball.color.replace(/[\d\.]+\)$/, '0.08)'));
        liquidGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = liquidGrad;
        ctx.fill();
      }

      // 2. FLUID LIQUID DROPLETS & CONSTELLATION MESH
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!prefersReducedMotion) {
          p.x += p.vx + Math.sin(time + p.pulseOffset) * 0.3;
          p.y += p.vy + Math.cos(time + p.pulseOffset) * 0.3;
        }

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Fluid Elasticity to Cursor
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = dist < 140 ? Math.min(p.alpha + 0.4, 0.95) : p.alpha;
        ctx.fill();

        // Liquid Glass Connector Beam
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = p.color === '#06b6d4' ? 'rgba(6, 182, 212, 0.35)' : 'rgba(99, 102, 241, 0.28)';
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />
    </div>
  );
};

export default PerspectiveGrid;
