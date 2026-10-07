import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal } from 'lucide-react';
import TextReveal from '../components/common/TextReveal';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      
      {/* Background glitch effect element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-2xl max-h-2xl rounded-full opacity-5 blur-[120px] bg-editorial-accent pointer-events-none"></div>

      <div className="w-16 h-16 rounded-xl border border-editorial-border bg-editorial-surface flex items-center justify-center text-editorial-accent mb-8 interactive-lift">
        <Terminal className="w-8 h-8" />
      </div>
      
      <TextReveal text="404 — NOT FOUND" className="text-4xl md:text-5xl font-bold font-grotesk tracking-widest text-white mb-6" as="h1" />
      
      <p className="text-editorial-textMuted font-mono text-sm max-w-md uppercase tracking-wider animate-fade-up delay-300 mb-10">
        The requested sector is offline. The content you are looking for has been moved or destroyed.
      </p>
      
      <div className="animate-fade-up delay-500">
        <Link to="/" className="btn-primary inline-flex items-center gap-3">
          Return to Base <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
