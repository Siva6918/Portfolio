import React, { useEffect } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const { registerSectionRef } = useAnalytics();

  useEffect(() => {
    document.title = "Blog & Articles | Venkata Siva Reddy";
  }, []);

  const dummyArticles = [
    {
      slug: 'react-state-management-guide',
      title: 'A Deep Dive into React State Management in 2024',
      date: 'Oct 15, 2023',
      readTime: '8 min read',
      category: 'React',
      excerpt: 'Exploring the modern ecosystem of React state management, from Context API to Redux Toolkit, Zustand, and when to use which.',
    },
    {
      slug: 'building-scalable-nodejs-apis',
      title: 'Building Scalable Node.js APIs with Express',
      date: 'Nov 02, 2023',
      readTime: '6 min read',
      category: 'Backend',
      excerpt: 'Best practices for structuring, securing, and scaling enterprise-grade REST APIs using Node.js and Express.',
    },
    {
      slug: 'understanding-javascript-closures',
      title: 'Demystifying JavaScript Closures',
      date: 'Dec 10, 2023',
      readTime: '5 min read',
      category: 'JavaScript',
      excerpt: 'A practical guide to understanding one of JavaScript\'s most powerful concepts with real-world examples.',
    }
  ];

  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-500" />
          Technical Blog
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
          Insights, tutorials, and deep dives into software engineering, web development, and my technical journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={(el) => registerSectionRef(el, 'Blog Articles')}>
        {dummyArticles.map(article => (
          <Link 
            key={article.slug}
            to={`/blog/${article.slug}`}
            className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300 h-full"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {article.category}
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-500">{article.readTime}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-3">
                {article.excerpt}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-zinc-500">{article.date}</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                Read Article →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
