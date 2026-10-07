import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';

const BlogPostPage = () => {
  const { slug } = useParams();

  useEffect(() => {
    document.title = `${slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | Venkata Siva Reddy`;
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>
      
      <article className="prose prose-slate dark:prose-invert prose-lg max-w-none">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-zinc-400 mb-4 font-mono">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Oct 15, 2023</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 8 min read</span>
            <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> Engineering</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
            {slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </h1>
        </div>
        
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <p className="lead text-xl text-slate-600 dark:text-slate-300">
            This is a placeholder for the technical article. In the future, this content will be dynamically fetched from the database or markdown files.
          </p>
          <h2>Introduction</h2>
          <p>
            When building scalable applications, one of the most important decisions is how to manage state.
            In this article, we'll explore the pros and cons of different state management solutions.
          </p>
          <h3>Why State Management Matters</h3>
          <p>
            State is the heart of any interactive application. Without it, your app is just a static website.
            However, as your app grows, managing state can become complex and error-prone.
          </p>
          <pre><code>{`// Example of state management
const [state, setState] = useState(initialState);

useEffect(() => {
  // Sync with external store
}, [state]);`}</code></pre>
          <h3>Conclusion</h3>
          <p>
            Choosing the right state management tool depends on your app's specific needs, complexity, and team experience.
          </p>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
