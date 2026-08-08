import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
        <Terminal className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">404 - Page Not Found</h1>
      <p className="text-slate-400 text-sm max-w-md">
        The route you are looking for does not exist or has been moved in Venkata Siva Reddy's Portfolio Space.
      </p>
      <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-semibold text-xs shadow-electric-sky">
        <ArrowLeft className="w-4 h-4" /> Back to Portfolio Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
