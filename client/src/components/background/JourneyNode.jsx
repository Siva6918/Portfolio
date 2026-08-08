import React from 'react';

const JourneyNode = ({ label, icon: Icon, isActive, isCompleted, x, y }) => {
  return (
    <g transform={`translate(${x}, ${y})`} className="cursor-pointer group">
      {/* Outer Glow Ring */}
      <circle
        r="18"
        fill={isActive ? 'rgba(6, 182, 212, 0.15)' : isCompleted ? 'rgba(99, 102, 241, 0.12)' : 'rgba(45, 45, 58, 0.5)'}
        stroke={isActive ? '#06b6d4' : isCompleted ? '#6366f1' : '#3f3f46'}
        strokeWidth={isActive ? '2' : '1.5'}
        className="transition-all duration-300 group-hover:scale-125"
      />

      {/* Inner Node Circle */}
      <circle
        r="10"
        fill={isActive ? '#09090b' : isCompleted ? '#09090b' : '#121217'}
        stroke={isActive ? '#06b6d4' : isCompleted ? '#6366f1' : '#52525b'}
        strokeWidth="1.5"
      />

      {/* Center Marker Dot */}
      <circle
        r="4"
        fill={isActive ? '#06b6d4' : isCompleted ? '#6366f1' : '#3f3f46'}
      />

      {/* Node Text Label */}
      <text
        y="32"
        textAnchor="middle"
        fill={isActive ? '#06b6d4' : isCompleted ? '#fafafa' : '#a1a1aa'}
        fontSize="10"
        fontFamily="monospace"
        fontWeight={isActive ? 'bold' : 'normal'}
      >
        {label}
      </text>
    </g>
  );
};

export default JourneyNode;
