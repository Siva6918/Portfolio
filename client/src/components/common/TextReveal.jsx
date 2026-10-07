import React from 'react';

const TextReveal = ({ text, className = '', delay = 0, as: Component = 'div' }) => {
  return (
    <Component className={`flex flex-wrap overflow-hidden ${className}`}>
      {text.split(' ').map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex mr-[0.35em] overflow-hidden whitespace-nowrap">
          {word.split('').map((char, charIdx) => {
            const index = wordIdx * 10 + charIdx;
            return (
              <span
                key={charIdx}
                className="inline-block animate-fade-up-text"
                style={{
                  animationDelay: `${delay + index * 30}ms`,
                  opacity: 0,
                  transform: 'translateY(100%)'
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </Component>
  );
};

export default TextReveal;
