import React from 'react';

const FloatingCode = () => {
  const codeSymbols = [
    { text: '< />', top: '15%', left: '88%', opacity: 0.08, color: '#8b5cf6' },
    { text: '{ }', top: '28%', left: '5%', opacity: 0.09, color: '#a1a1aa' },
    { text: 'git commit -m "build"', top: '42%', left: '85%', opacity: 0.07, color: '#34d399' },
    { text: 'npm run dev', top: '56%', left: '4%', opacity: 0.08, color: '#7dd3fc' },
    { text: 'const dev = { mern: true }', top: '70%', left: '86%', opacity: 0.07, color: '#a855f7' },
    { text: 'AWS.S3.upload()', top: '84%', left: '6%', opacity: 0.08, color: '#fafafa' }
  ];

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden md:block">
      {codeSymbols.map((item, idx) => (
        <span
          key={idx}
          className="absolute font-mono text-xs font-bold tracking-widest transition-opacity duration-700"
          style={{
            top: item.top,
            left: item.left,
            opacity: item.opacity,
            color: item.color
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
};

export default FloatingCode;
