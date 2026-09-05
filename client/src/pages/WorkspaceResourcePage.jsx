import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Play, FileText, FileType, Sheet, 
  Link as LinkIcon, Image as ImageIcon, ExternalLink, 
  Download, Eye, AlertCircle, RefreshCw, Maximize2, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { getWorkspaceItemBySlug } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';

const RESOURCE_META = {
  video:    { label: 'Video Resource',       icon: Play,      color: '#f43f5e', bgTint: 'rgba(244, 63, 94, 0.12)' },
  pdf:      { label: 'PDF Document',         icon: FileText,  color: '#6366f1', bgTint: 'rgba(99, 102, 241, 0.12)' },
  document: { label: 'Word Document',        icon: FileType,  color: '#3b82f6', bgTint: 'rgba(59, 130, 246, 0.12)' },
  excel:    { label: 'Excel Spreadsheet',    icon: Sheet,     color: '#10b981', bgTint: 'rgba(16, 185, 129, 0.12)' },
  image:    { label: 'Image Asset',          icon: ImageIcon, color: '#f59e0b', bgTint: 'rgba(245, 158, 11, 0.12)' },
  link:     { label: 'External Resource',    icon: LinkIcon,  color: '#8b5cf6', bgTint: 'rgba(139, 92, 246, 0.12)' },
};

const WorkspaceResourcePage = () => {
  const { category, slug } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchResource = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getWorkspaceItemBySlug(category, slug);
        const data = res.data?.data;
        if (!data || !data.isVisible) {
          throw new Error('Workspace item not found.');
        }
        if (isMounted) {
          setItem(data);
          // Set Page Title for SEO and Sharing
          document.title = `${data.name} | ${data.category === 'work' ? 'Work Space' : 'Personal Space'} | Siva Reddy`;
          
          // Update Meta description
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
          }
          metaDesc.content = data.description || `View ${data.name} in Siva Reddy's portfolio workspace.`;
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Unable to load this resource.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchResource();

    return () => {
      isMounted = false;
      document.title = 'Siva Reddy | Portfolio & Workspace';
    };
  }, [category, slug]);

  const meta = item ? (RESOURCE_META[item.resourceType] || { label: 'Resource', icon: FileText, color: '#38bdf8', bgTint: 'rgba(56, 189, 248, 0.12)' }) : null;
  const Icon = meta?.icon;
  const accentColor = meta?.color || '#38bdf8';

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200/60 dark:bg-zinc-800/60 text-xs font-mono text-slate-500 animate-pulse">
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </div>
        <div className="h-10 w-2/3 bg-slate-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
        <div className="h-5 w-1/2 bg-slate-200/80 dark:bg-zinc-800/80 rounded-lg animate-pulse" />
        <div className="h-96 w-full bg-slate-200/60 dark:bg-zinc-900 rounded-2xl animate-pulse border border-slate-300/40 dark:border-zinc-800" />
      </div>
    );
  }

  // Error / Not Found State
  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-[#0c0c12] shadow-2xl backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Workspace Item Not Found</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
              {error || "The resource you are looking for doesn't exist, is private, or may have been removed."}
            </p>
          </div>
          <Link
            to="/#workspace"
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono transition-transform active:scale-95 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </Link>
        </div>
      </div>
    );
  }

  // Render resource based on type
  const renderResourceViewer = () => {
    const resourceUrl = item.resource?.url;

    // VIDEO VIEWER
    if (item.resourceType === 'video') {
      return (
        <div className="rounded-2xl overflow-hidden border border-slate-300/80 dark:border-zinc-800 bg-black shadow-2xl relative">
          <video
            src={resourceUrl}
            controls
            playsInline
            controlsList="nodownload"
            poster={item.coverImage?.url}
            className="w-full max-h-[70vh] object-contain mx-auto bg-black"
          >
            Your browser does not support HTML5 video playback.
          </video>
        </div>
      );
    }

    // PDF VIEWER
    if (item.resourceType === 'pdf') {
      return (
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden border border-slate-300/80 dark:border-zinc-800 bg-slate-900/90 shadow-2xl h-[75vh] relative">
            <iframe
              src={`${resourceUrl}#toolbar=1&navpanes=0`}
              title={item.name}
              className="w-full h-full border-0 bg-white"
            />
          </div>
          <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
            <span>Embedded PDF Document Viewer</span>
            <a
              href={resourceUrl}
              download={item.name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors font-bold"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </a>
          </div>
        </div>
      );
    }

    // IMAGE VIEWER
    if (item.resourceType === 'image') {
      const displayImg = resourceUrl || item.coverImage?.url;
      return (
        <div className="rounded-2xl overflow-hidden border border-slate-300/80 dark:border-zinc-800 bg-[#07070a] shadow-2xl p-4 flex items-center justify-center min-h-[50vh] max-h-[75vh]">
          <img
            src={displayImg}
            alt={item.name}
            className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg transition-transform duration-300 hover:scale-[1.01]"
          />
        </div>
      );
    }

    // DOCUMENT (Word / Docs)
    if (item.resourceType === 'document') {
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(resourceUrl)}&embedded=true`;
      return (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-300/80 dark:border-zinc-800 bg-white shadow-2xl h-[70vh] relative">
            <iframe
              src={googleViewerUrl}
              title={item.name}
              className="w-full h-full border-0"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900/60">
            <div className="text-xs text-slate-600 dark:text-zinc-400">
              Document format: <span className="font-mono font-bold uppercase text-blue-500">{item.resourceFormat || 'DOC'}</span>
            </div>
            <a
              href={resourceUrl}
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-mono font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download Document
            </a>
          </div>
        </div>
      );
    }

    // EXCEL / SPREADSHEET
    if (item.resourceType === 'excel') {
      const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resourceUrl)}`;
      return (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-300/80 dark:border-zinc-800 bg-white shadow-2xl h-[70vh] relative">
            <iframe
              src={officeViewerUrl}
              title={item.name}
              className="w-full h-full border-0"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900/60">
            <div className="text-xs text-slate-600 dark:text-zinc-400">
              Spreadsheet format: <span className="font-mono font-bold uppercase text-emerald-500">{item.resourceFormat || 'XLSX'}</span>
            </div>
            <a
              href={resourceUrl}
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download Spreadsheet
            </a>
          </div>
        </div>
      );
    }

    // EXTERNAL LINK
    if (item.resourceType === 'link' || item.externalUrl) {
      const targetUrl = item.externalUrl || resourceUrl;
      return (
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-300/80 dark:border-zinc-800/80 bg-white/90 dark:bg-[#0c0c12] text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-lg shadow-purple-500/10">
            <ExternalLink className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">External Web Resource</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              This resource is hosted externally. Clicking below will open the destination safely in a new browser tab.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 font-mono text-[11px] break-all border border-slate-200 dark:border-zinc-800">
                {targetUrl}
              </span>
            </div>
          </div>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all shadow-xl shadow-purple-600/25 active:scale-95"
          >
            <span>Visit Resource</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      );
    }

    // Fallback default
    return (
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-400">
        No interactive viewer available for this file type.
      </div>
    );
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (window.history.state && window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/#workspace');
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border"
            style={{
              background: item.category === 'work' ? 'rgba(74, 222, 128, 0.12)' : 'rgba(45, 212, 191, 0.12)',
              borderColor: item.category === 'work' ? 'rgba(74, 222, 128, 0.35)' : 'rgba(45, 212, 191, 0.35)',
              color: item.category === 'work' ? '#4ade80' : '#2dd4bf'
            }}
          >
            {item.category === 'work' ? 'Work Space' : 'Personal Space'}
          </span>
          {meta && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border"
              style={{ background: meta.bgTint, borderColor: `${meta.color}40`, color: meta.color }}>
              {Icon && <Icon className="w-3 h-3" />} {meta.label}
            </span>
          )}
        </div>
      </div>

      {/* Main Resource Header Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-zinc-800/80 bg-white/90 dark:bg-[#09090c]/90 p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Cover photo preview */}
          {item.coverImage?.url && (
            <div className="relative w-full md:w-64 h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shrink-0 bg-[#07070a] shadow-md flex items-center justify-center">
              <img
                src={item.coverImage.url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
              />
              <img
                src={item.coverImage.url}
                alt={item.name}
                className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain p-1"
              />
            </div>
          )}

          <div className="space-y-3 flex-grow">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.name}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-sans">
              {item.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-mono text-slate-400 dark:text-zinc-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Verified Internal Portfolio Route
              </span>
              <span>•</span>
              <span>Category: {item.category}</span>
              {item.resourceFormat && (
                <>
                  <span>•</span>
                  <span className="uppercase">Format: {item.resourceFormat}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Viewer Body */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-2">
            <span>Portfolio Resource Viewer</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
          </h3>
        </div>

        {renderResourceViewer()}
      </div>

    </div>
  );
};

export default WorkspaceResourcePage;
