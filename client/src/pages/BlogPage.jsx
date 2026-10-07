import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNotes } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';

const BlogPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Notes | Venkata Siva Reddy";
    window.scrollTo(0, 0);

    getNotes().then(res => {
      if (res.data && res.data.data) {
        // Filter out drafts on public site
        setNotes(res.data.data.filter(n => n.isPublished));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="section-container"><SkeletonLoader count={3} /></div>;

  return (
    <div className="section-container animate-fade-in pt-32">
      <h1 className="text-4xl sm:text-5xl font-bold mb-8 font-grotesk text-white">Notes</h1>
      <p className="text-editorial-textMuted font-mono text-sm max-w-2xl leading-relaxed mb-16 uppercase tracking-wider">
        Engineering notes, tutorials, and thoughts on software development.
      </p>

      {notes.length === 0 ? (
        <div className="text-editorial-textMuted font-mono text-sm uppercase tracking-widest border-t border-editorial-border py-12">
          No notes published yet.
        </div>
      ) : (
        <div className="flex flex-col">
          {notes.map(note => (
            <Link 
              key={note._id} 
              to={`/notes/${note.slug}`}
              className="group flex flex-col py-8 border-t border-editorial-border hover:bg-[#1a1a1a] transition-colors -mx-6 px-6"
            >
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-editorial-textMuted uppercase tracking-widest mb-4">
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                <span className="w-1 h-1 bg-editorial-border rounded-full"></span>
                <span className="text-editorial-accent">{note.category}</span>
                <span className="w-1 h-1 bg-editorial-border rounded-full"></span>
                <span>{note.readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-editorial-accent transition-colors font-grotesk mb-3">
                {note.title}
              </h2>
              <p className="text-editorial-textMain text-base max-w-3xl line-clamp-2">
                {note.excerpt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
