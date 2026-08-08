import React, { useEffect, useRef } from 'react';

const SivaSpaceLayeredBackground = () => {
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

    // Layer 4: Sparse Data Particles (70% White, 20% Gray, 5% Sky Blue, 5% Purple)
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => {
      const rand = Math.random();
      let color = '#fafafa';
      if (rand > 0.7 && rand <= 0.9) color = '#a1a1aa';
      else if (rand > 0.9 && rand <= 0.95) color = '#7dd3fc';
      else if (rand > 0.95) color = '#8b5cf6';

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        color
      };
    });

    // Layer 2: Perspective Career Road Z-Offset
    let roadOffsetZ = 0;
    const roadSpeed = 0.6;
    const horizonY = height * 0.48;
    const focalLength = 340;

    let time = 0;

    const render = () => {
      time += 0.008;
      roadOffsetZ = (roadOffsetZ + roadSpeed) % 50;
      ctx.clearRect(0, 0, width, height);

      // LAYER 1: Obsidian Base Environment Gradient
      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      baseGrad.addColorStop(0, '#09090b');
      baseGrad.addColorStop(0.5, '#111113');
      baseGrad.addColorStop(1, '#18181b');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // Layer 1 Ambient Nebulae
      const purpleOrb = ctx.createRadialGradient(width * 0.2, height * 0.2, 10, width * 0.2, height * 0.2, width * 0.35);
      purpleOrb.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
      purpleOrb.addColorStop(1, 'transparent');
      ctx.fillStyle = purpleOrb;
      ctx.fillRect(0, 0, width, height);

      const skyOrb = ctx.createRadialGradient(width * 0.8, height * 0.7, 10, width * 0.8, height * 0.7, width * 0.3);
      skyOrb.addColorStop(0, 'rgba(125, 211, 252, 0.06)');
      skyOrb.addColorStop(1, 'transparent');
      ctx.fillStyle = skyOrb;
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      // LAYER 3: Ghosted Digital Campus Architecture Silhouettes (Opacity 0.08 - 0.15)
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 1;

      // Abstract Building 1: CSE LAB (Left)
      const b1X = width * 0.12;
      const b1Y = horizonY - 140;
      ctx.strokeRect(b1X, b1Y, 110, 140);
      ctx.beginPath();
      ctx.moveTo(b1X - 10, b1Y);
      ctx.lineTo(b1X + 55, b1Y - 35);
      ctx.lineTo(b1X + 120, b1Y);
      ctx.stroke();

      // Abstract Building 2: MAIN CAMPUS (Center Horizon)
      const b2X = width * 0.5 - 75;
      const b2Y = horizonY - 180;
      ctx.strokeRect(b2X, b2Y, 150, 180);
      ctx.beginPath();
      ctx.arc(width * 0.5, b2Y - 30, 30, 0, Math.PI * 2);
      ctx.stroke();

      // Abstract Building 3: PROJECT LAB (Right)
      const b3X = width * 0.78;
      const b3Y = horizonY - 120;
      ctx.strokeRect(b3X, b3Y, 100, 120);

      // LAYER 2: 🛣️ Perspective Career Road (Signature Background Element)
      ctx.globalAlpha = 1.0;
      const centerX = width / 2;

      // Perspective Radial Road Lines
      const roadLineCount = 18;
      for (let i = -roadLineCount / 2; i <= roadLineCount / 2; i++) {
        const xOffset = i * 75;
        const farX = centerX + (xOffset * focalLength) / 2200;
        const nearX = centerX + (xOffset * focalLength) / 180;

        ctx.beginPath();
        ctx.moveTo(farX, horizonY);
        ctx.lineTo(nearX, height);

        const lineAlpha = (1 - Math.abs(i) / (roadLineCount / 2)) * 0.28;
        if (i === 0) {
          // Center Road Pulse Line (Purple #8B5CF6 with Sky Highlight #7DD3FC)
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.45)';
          ctx.lineWidth = 1.8;
        } else if (Math.abs(i) % 3 === 0) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
          ctx.lineWidth = 1.2;
        } else {
          ctx.strokeStyle = `rgba(82, 82, 91, ${lineAlpha * 0.9})`;
          ctx.lineWidth = 0.8;
        }
        ctx.stroke();
      }

      // Transverse Road Step Lines moving forward into infinity
      const depthStep = 45;
      for (let z = 100; z < 1100; z += depthStep) {
        const adjustedZ = z - roadOffsetZ;
        if (adjustedZ <= 10) continue;

        const screenY = horizonY + (focalLength * 360) / adjustedZ;
        if (screenY > height || screenY < horizonY) continue;

        const distanceAlpha = (1 - adjustedZ / 1100) * 0.26;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(width, screenY);
        ctx.strokeStyle = `rgba(39, 39, 42, ${distanceAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // LAYER 4: Sparse Technology Data Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(time + i) * 0.2;
        p.y += p.vy + Math.cos(time + i) * 0.2;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = p.color === '#7dd3fc' || p.color === '#8b5cf6' ? 8 : 0;
        ctx.shadowColor = p.color;
        ctx.fill();
      }

      ctx.restore();

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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />
    </div>
  );
};

export default SivaSpaceLayeredBackground;
