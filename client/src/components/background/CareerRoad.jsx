import React from 'react';
import JourneyNode from './JourneyNode';

const CareerRoad = () => {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden lg:block">
      <svg className="w-full h-full opacity-75" preserveAspectRatio="none" viewBox="0 0 1400 900">
        
        {/* Main Base Road SVG Path */}
        <path
          d="M 1200 140 C 1320 280, 1150 480, 950 620 C 800 720, 700 800, 700 860"
          fill="none"
          stroke="#2d2d3a"
          strokeWidth="3.5"
          strokeDasharray="8 6"
        />

        {/* Electric Indigo Glowing Base Track */}
        <path
          d="M 1200 140 C 1320 280, 1150 480, 950 620 C 800 720, 700 800, 700 860"
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          strokeOpacity="0.5"
        />

        {/* Continuous Flowing Cyber Cyan Laser Stream */}
        <path
          d="M 1200 140 C 1320 280, 1150 480, 950 620 C 800 720, 700 800, 700 860"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeDasharray="40 160"
          className="animate-road-stream"
        />

        {/* 1. 🎓 EDUCATION (Visible below navbar) */}
        <JourneyNode label="🎓 EDUCATION" isCompleted={true} x={1200} y={140} />

        {/* 2. Environmental Marker: 300+ DSA Problems */}
        <g transform="translate(1240, 320)">
          <circle r="5" fill="#06b6d4" className="animate-ping opacity-75" />
          <circle r="5" fill="#06b6d4" />
          <circle r="12" fill="none" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.6" />
          <text x="18" y="4" fill="#fafafa" fontSize="11" fontFamily="monospace" fontWeight="bold">● 300+ DSA</text>
        </g>

        {/* 3. 💻 CSE LAB */}
        <JourneyNode label="💻 CSE LAB" isCompleted={true} x={1120} y={440} />

        {/* 4. Environmental Marker: 5+ Full Stack Projects */}
        <g transform="translate(980, 560)">
          <circle r="5" fill="#10b981" />
          <circle r="12" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.6" />
          <text x="-105" y="4" fill="#fafafa" fontSize="11" fontFamily="monospace" fontWeight="bold">● 5+ PROJECTS</text>
        </g>

        {/* 5. 🏢 EXPERIENCE */}
        <JourneyNode label="🏢 EXPERIENCE" isActive={true} x={900} y={660} />

        {/* 6. Environmental Marker: 2027 Graduation */}
        <g transform="translate(760, 780)">
          <circle r="5" fill="#6366f1" />
          <circle r="12" fill="none" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.6" />
          <text x="18" y="4" fill="#fafafa" fontSize="11" fontFamily="monospace" fontWeight="bold">● 2027 GRADUATION</text>
        </g>

        {/* 7. 🎯 CONTINUOUSLY ROTATING & PULSING SVG DESTINATION GATE */}
        <g transform="translate(700, 860)">
          <ellipse rx="55" ry="22" fill="none" stroke="#6366f1" strokeWidth="2" strokeOpacity="0.8" />
          <ellipse rx="70" ry="28" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.7" className="animate-spin-slow" />
          <ellipse rx="85" ry="34" fill="none" stroke="#c084fc" strokeWidth="0.8" strokeOpacity="0.4" />
          
          <circle r="6" fill="#6366f1" className="animate-pulse" />
          <circle r="14" fill="none" stroke="#06b6d4" strokeWidth="1.5" />

          <text y="-36" textAnchor="middle" fill="#06b6d4" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
            DESTINATION GATE
          </text>
          <text y="45" textAnchor="middle" fill="#fafafa" fontSize="12" fontFamily="monospace" fontWeight="bold">
            2027 SOFTWARE ENGINEER
          </text>
        </g>

      </svg>
    </div>
  );
};

export default CareerRoad;
