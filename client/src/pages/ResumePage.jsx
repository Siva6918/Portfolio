import React, { useEffect, useState } from 'react';
import { getResume, resolveMediaUrl } from '../services/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { Download } from 'lucide-react';

const ResumePage = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Resume | Venkata Siva Reddy";
    window.scrollTo(0, 0);

    getResume().then(res => {
      if (res.data && res.data.data) {
        setResume(res.data.data);
      } else {
        setError("Resume not currently available.");
      }
      setLoading(false);
    }).catch(() => {
      setError("Failed to load resume document.");
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="section-container"><SkeletonLoader count={1} /></div>;
  if (error || !resume) return <div className="section-container text-editorial-textMain">{error}</div>;

  const resumeUrl = resolveMediaUrl(resume.url);

  return (
    <div className="section-container animate-fade-in pt-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold font-grotesk text-white mb-4">Resume</h1>
          <p className="text-editorial-textMuted font-mono text-xs uppercase tracking-widest">
            Last updated: {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : 'Recently'}
          </p>
        </div>
        
        <a 
          href={resumeUrl} 
          download="Venkata_Siva_Reddy_Resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Download PDF
        </a>
      </div>

      <div className="w-full h-[80vh] border border-editorial-border bg-editorial-surface p-2">
        <iframe 
          src={`${resumeUrl}#view=FitH`}
          className="w-full h-full border-none"
          title="Resume PDF Viewer"
        />
      </div>
    </div>
  );
};

export default ResumePage;
