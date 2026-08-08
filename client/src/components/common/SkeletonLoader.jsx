import React from 'react';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass-card rounded-2xl p-6 space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
