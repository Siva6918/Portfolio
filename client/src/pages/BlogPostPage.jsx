import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNoteBySlug, resolveMediaUrl } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getNoteBySlug(slug).then(res => {
      if (res.data && res.data.data) {
        setNote(res.data.data);
        document.title = `${res.data.data.title} | Notes`;
      } else {
        setError('Note not found');
      }
      setLoading(false);
    }).catch(err => {
      setError('Failed to load note');
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="section-container"><SkeletonLoader count={1} /></div>;
  if (error || !note) return <div className="section-container text-editorial-textMain">{error}</div>;

  return (
    <div className="section-container animate-fade-in pt-32 max-w-3xl">
      <Link to="/notes" className="text-editorial-textMuted font-mono text-xs uppercase hover:text-editorial-accent tracking-widest mb-12 inline-block">
        ← Back to Notes
      </Link>

      <article>
        <header className="mb-12 border-b border-editorial-border pb-12">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-editorial-textMuted uppercase tracking-widest mb-6">
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            <span className="w-1 h-1 bg-editorial-border rounded-full"></span>
            <span className="text-editorial-accent">{note.category}</span>
            <span className="w-1 h-1 bg-editorial-border rounded-full"></span>
            <span>{note.readTime}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-grotesk text-white leading-tight mb-6">
            {note.title}
          </h1>
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-mono text-editorial-textMuted bg-editorial-surface border border-editorial-border uppercase">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {note.coverImage && (
          <div className="mb-12">
            <img 
              src={resolveMediaUrl(note.coverImage)} 
              alt={note.title} 
              className="w-full h-auto object-cover border border-editorial-border grayscale hover:grayscale-0 transition-all duration-700" 
            />
          </div>
        )}

        <div 
          className="prose prose-invert prose-editorial max-w-none prose-p:text-editorial-textMain prose-p:text-lg prose-p:leading-relaxed prose-headings:font-grotesk prose-headings:text-white prose-a:text-editorial-accent prose-a:no-underline hover:prose-a:underline prose-pre:bg-editorial-surface prose-pre:border prose-pre:border-editorial-border"
          dangerouslySetInnerHTML={{ __html: note.content }} // In a real app, use a markdown parser here if the content is MD
        />

      </article>

      {((note.relatedProjects && note.relatedProjects.length > 0) || (note.relatedNotes && note.relatedNotes.length > 0)) && (
        <div className="mt-24 border-t border-editorial-border pt-12">
          <h3 className="text-sm font-mono text-editorial-accent tracking-widest uppercase mb-8">Related Material</h3>
          <div className="space-y-6">
            {note.relatedProjects?.map(project => (
              <Link key={project._id} to={`/work/${project.slug}`} className="block group">
                <span className="text-editorial-textMuted font-mono text-xs uppercase mr-4">Project</span>
                <span className="text-white group-hover:text-editorial-accent transition-colors font-grotesk text-lg">{project.title}</span>
              </Link>
            ))}
            {note.relatedNotes?.map(relatedNote => (
              <Link key={relatedNote._id} to={`/notes/${relatedNote.slug}`} className="block group">
                <span className="text-editorial-textMuted font-mono text-xs uppercase mr-4">Note</span>
                <span className="text-white group-hover:text-editorial-accent transition-colors font-grotesk text-lg">{relatedNote.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage;
