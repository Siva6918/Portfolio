import React, { useEffect, useRef } from 'react';

const FloatingGlass3DBackground = () => {
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

    // 3D Floating Glass Orbs & Crystal Polyhedrons
    const glassObjects = [
      { x: width * 0.15, y: height * 0.25, z: 1.2, radius: 90, vx: 0.3, vy: 0.2, rotation: 0, rotSpeed: 0.008, color1: 'rgba(139, 92, 246, 0.4)', color2: 'rgba(125, 211, 252, 0.15)', shape: 'sphere' },
      { x: width * 0.8, y: height * 0.35, z: 0.9, radius: 120, vx: -0.25, vy: 0.18, rotation: 1.5, rotSpeed: -0.006, color1: 'rgba(236, 72, 153, 0.35)', color2: 'rgba(168, 85, 247, 0.15)', shape: 'cube' },
      { x: width * 0.65, y: height * 0.75, z: 1.5, radius: 80, vx: 0.2, vy: -0.25, rotation: 3.1, rotSpeed: 0.01, color1: 'rgba(125, 211, 252, 0.4)', color2: 'rgba(250, 250, 250, 0.2)', shape: 'sphere' },
      { x: width * 0.25, y: height * 0.8, z: 0.8, radius: 110, vx: -0.18, vy: -0.2, rotation: 0.8, rotSpeed: -0.007, color1: 'rgba(168, 85, 247, 0.35)', color2: 'rgba(236, 72, 153, 0.15)', shape: 'cube' },
      { x: width * 0.5, y: height * 0.2, z: 1.1, radius: 70, vx: 0.15, vy: 0.22, rotation: 2.2, rotSpeed: 0.009, color1: 'rgba(250, 250, 250, 0.3)', color2: 'rgba(139, 92, 246, 0.15)', shape: 'sphere' }
    ];

    // Floating glass dust / refraction micro-particles
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#8b5cf6' : Math.random() > 0.5 ? '#7dd3fc' : '#fafafa'
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Render Floating 3D Glass Objects
      for (let i = 0; i < glassObjects.map.length || i < glassObjects.length; i++) {
        const obj = glassObjects[i];
        obj.x += obj.vx + Math.sin(time + obj.rotation) * 0.5;
        obj.y += obj.vy + Math.cos(time + obj.rotation) * 0.5;
        obj.rotation += obj.rotSpeed;

        if (obj.x < -100 || obj.x > width + 100) obj.vx *= -1;
        if (obj.y < -100 || obj.y > height + 100) obj.vy *= -1;

        const floatRadius = obj.radius + Math.sin(time * 1.5 + obj.rotation) * 6;

        ctx.save();
        ctx.translate(obj.x, obj.y);

        if (obj.shape === 'sphere') {
          // 3D Glass Sphere Reflection Gradient
          const grad = ctx.createRadialGradient(
            -floatRadius * 0.3, -floatRadius * 0.3, floatRadius * 0.1,
            0, 0, floatRadius
          );
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
          grad.addColorStop(0.3, obj.color1);
          grad.addColorStop(0.8, obj.color2);
          grad.addColorStop(1, 'rgba(9, 9, 11, 0.4)');

          ctx.beginPath();
          ctx.arc(0, 0, floatRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.shadowBlur = 30;
          ctx.shadowColor = obj.color1;
          ctx.fill();

          // 3D Specular Light Rim Accent
          ctx.beginPath();
          ctx.arc(0, 0, floatRadius - 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

        } else if (obj.shape === 'cube') {
          // 3D Rotating Glass Cube / Diamond
          ctx.rotate(obj.rotation);
          const size = floatRadius * 1.4;

          const grad = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
          grad.addColorStop(0.4, obj.color1);
          grad.addColorStop(1, obj.color2);

          ctx.beginPath();
          ctx.roundRect(-size/2, -size/2, size, size, 20);
          ctx.fillStyle = grad;
          ctx.shadowBlur = 35;
          ctx.shadowColor = obj.color1;
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.restore();
      }

      // Render Floating Refraction Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
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
      {/* Ambient Deep 3D Space Base */}
      <div className="absolute inset-0 bg-[#09090b]"></div>

      {/* Specular Ambient Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-[45rem] h-[45rem] rounded-full bg-[#8b5cf6]/18 blur-[160px] animate-pulse"></div>
      <div className="absolute top-1/3 -right-40 w-[40rem] h-[40rem] rounded-full bg-[#7dd3fc]/15 blur-[160px]"></div>
      <div className="absolute -bottom-40 left-1/3 w-[45rem] h-[45rem] rounded-full bg-[#ec4899]/12 blur-[180px]"></div>

      {/* Floating 3D Glass Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-75" />
    </div>
  );
};

export default FloatingGlass3DBackground;
