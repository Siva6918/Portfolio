import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Download, FileText, Eye } from 'lucide-react';
import { getResume, resolveMediaUrl } from '../services/api';

const ResumePage = () => {
  const { trackInteraction } = useAnalytics();
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    document.title = "Resume | Venkata Siva Reddy";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getResume();
      if (res.data?.data?.url) {
        setResumeUrl(resolveMediaUrl(res.data.data.url));
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
    }
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">My Resume</h1>
        <p className="text-slate-600 dark:text-slate-400">View or download my professional resume.</p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-12">
        {resumeUrl ? (
          <>
            <a 
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackInteraction('resume_view', 'Resume Page', 'Resume')}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 dark:bg-zinc-800 text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg"
            >
              <Eye className="w-5 h-5" /> View Full Screen
            </a>
            <a 
              href={resumeUrl}
              download
              onClick={() => trackInteraction('resume_download', 'Resume Page', 'Resume')}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-5 h-5" /> Download PDF
            </a>
          </>
        ) : (
          <div className="px-6 py-3 bg-slate-200 dark:bg-zinc-800 text-slate-500 rounded-xl">
            Resume not available right now.
          </div>
        )}
      </div>

      {resumeUrl && (
        <div className="w-full h-[80vh] border-2 border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <iframe 
            src={resumeUrl} 
            className="w-full h-full"
            title="Venkata Siva Reddy Resume"
          />
        </div>
      )}
    </div>
  );
};

export default ResumePage;
