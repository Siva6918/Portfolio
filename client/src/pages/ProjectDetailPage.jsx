import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, ShieldCheck, CheckCircle2, Terminal } from 'lucide-react';
import { getProjectBySlug } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await getProjectBySlug(slug);
      if (res.data && res.data.data) {
        setProject(res.data.data);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20">
        <SkeletonLoader count={1} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Project Not Found</h2>
        <p className="text-slate-400 text-sm">{error || 'The requested project could not be found.'}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-400 text-xs font-mono transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase font-bold">
            {project.category}
          </span>
          <span className="text-xs font-mono text-slate-400">Status: {project.status || 'Completed'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {project.title}
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {project.shortDescription}
        </p>

        {/* Links */}
        <div className="flex items-center gap-4 pt-2">
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs border border-slate-700 hover:border-sky-400 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>View Source Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-semibold text-xs shadow-electric-sky hover:bg-sky-400 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Application</span>
            </a>
          )}
        </div>
      </div>

      {/* Thumbnail Banner */}
      <div className="w-full aspect-video rounded-3xl overflow-hidden glass-card border border-slate-700/80 shadow-2xl">
        <img
          src={project.thumbnail || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800'}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono uppercase text-sky-400">
            The Problem Statement
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {project.problem || project.description}
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono uppercase text-emerald-400">
            Architectural Solution
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {project.solution || project.description}
          </p>
        </div>
      </div>

      {/* Key Features List */}
      {project.features && project.features.length > 0 && (
        <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-sky-400" />
            <span>Key Platform Capabilities & Features</span>
          </h3>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {project.features.map((feat) => (
              <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0"></span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Technologies */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          <span>Technology & Infrastructure Stack</span>
        </h3>

        <div className="flex flex-wrap gap-2 pt-2">
          {project.technologies?.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 font-semibold"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProjectDetailPage;
