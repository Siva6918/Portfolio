import React, { useEffect, useRef } from 'react';

const GlassGridInfiniteSpaceBackground = () => {
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

    // Infinite 3D Grid Parameters
    let gridOffsetZ = 0;
    const speed = 0.8;

    // Horizon line (vanishing point position)
    const horizonY = height * 0.45;
    const focalLength = 320;

    // Tiny sky-blue highlights
    const highlightNodes = Array.from({ length: 15 }, () => ({
      x: (Math.random() - 0.5) * 1200,
      z: Math.random() * 1000 + 100,
      size: Math.random() * 3 + 2
    }));

    const render = () => {
      gridOffsetZ = (gridOffsetZ + speed) % 60;
      ctx.clearRect(0, 0, width, height);

      // Deep Charcoal & Purple Infinite Space Background
      const spaceGrad = ctx.createLinearGradient(0, 0, 0, height);
      spaceGrad.addColorStop(0, '#09090b');
      spaceGrad.addColorStop(0.45, '#111113');
      spaceGrad.addColorStop(1, '#09090b');
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft Ambient Purple & Gray Horizon Glow
      const horizonGlow = ctx.createRadialGradient(
        width / 2, horizonY, 10,
        width / 2, horizonY, width * 0.6
      );
      horizonGlow.addColorStop(0, 'rgba(139, 92, 246, 0.22)');
      horizonGlow.addColorStop(0.4, 'rgba(39, 39, 42, 0.15)');
      horizonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      // Draw Infinite 3D Perspective Glass Grid Lines
      const centerX = width / 2;

      // 1. Perspective Perspective Radial Lines (extending from horizon center outwards)
      const lineCount = 36;
      for (let i = -lineCount / 2; i <= lineCount / 2; i++) {
        const xOffset = i * 65;
        const farX = centerX + (xOffset * focalLength) / 2000;
        const nearX = centerX + (xOffset * focalLength) / 200;

        ctx.beginPath();
        ctx.moveTo(farX, horizonY);
        ctx.lineTo(nearX, height);

        // Gray / Purple / White glass line stroke
        const lineAlpha = (1 - Math.abs(i) / (lineCount / 2)) * 0.22;
        ctx.strokeStyle = i % 3 === 0 ? `rgba(139, 92, 246, ${lineAlpha})` : i % 2 === 0 ? `rgba(250, 250, 250, ${lineAlpha * 0.8})` : `rgba(161, 161, 170, ${lineAlpha * 0.7})`;
        ctx.lineWidth = i % 3 === 0 ? 1.2 : 0.8;
        ctx.stroke();
      }

      // 2. Transverse Horizontal Grid Lines moving forward to infinity
      const depthStep = 40;
      for (let z = 100; z < 1200; z += depthStep) {
        const adjustedZ = z - gridOffsetZ;
        if (adjustedZ <= 10) continue;

        const screenY = horizonY + (focalLength * 350) / adjustedZ;
        if (screenY > height || screenY < horizonY) continue;

        const distanceAlpha = (1 - adjustedZ / 1200) * 0.25;

        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(width, screenY);
        ctx.strokeStyle = `rgba(161, 161, 170, ${distanceAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Tiny Sky-Blue Intersection Highlights
      for (let i = 0; i < highlightNodes.length; i++) {
        const node = highlightNodes[i];
        node.z -= speed;
        if (node.z < 50) {
          node.z = 1000;
          node.x = (Math.random() - 0.5) * 1200;
        }

        const screenX = centerX + (node.x * focalLength) / node.z;
        const screenY = horizonY + (focalLength * 350) / node.z;

        if (screenX >= 0 && screenX <= width && screenY >= horizonY && screenY <= height) {
          const alpha = (1 - node.z / 1000) * 0.8;
          ctx.beginPath();
          ctx.arc(screenX, screenY, node.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(125, 211, 252, ${alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#7dd3fc';
          ctx.fill();
        }
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
      {/* Deep 3D Space Base */}
      <div className="absolute inset-0 bg-[#09090b]"></div>

      {/* Infinite 3D Glass Grid Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-85" />
    </div>
  );
};

export default GlassGridInfiniteSpaceBackground;
