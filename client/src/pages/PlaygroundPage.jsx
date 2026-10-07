import React, { useEffect } from 'react';
import PlaygroundSection from '../components/sections/PlaygroundSection';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { Gamepad2 } from 'lucide-react';

const PlaygroundPage = () => {
  useEffect(() => {
    document.title = "Playground | Venkata Siva Reddy";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="section-container pt-32">
      <RevealOnScroll className="animate-fade-up">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 font-grotesk text-white flex items-center gap-4">
          <Gamepad2 className="w-8 h-8 text-editorial-accent" /> Playground
        </h1>
        <p className="text-editorial-textMuted font-mono text-sm max-w-2xl leading-relaxed mb-16 uppercase tracking-wider">
          Interactive components, algorithm visualizers, and experimental micro-apps.
        </p>
      </RevealOnScroll>
      
      <div className="mt-12">
        <PlaygroundSection />
      </div>
    </div>
  );
};

export default PlaygroundPage;
