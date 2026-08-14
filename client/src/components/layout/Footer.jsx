import React, { useState } from 'react';
import { ArrowUp, Github, Linkedin, Mail, MessageSquare, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../context/AnalyticsContext';
import { buildApiUrl } from '../../services/api';

const Footer = () => {
  const { trackInteraction } = useAnalytics();
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', feedback: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;

    if (!feedbackForm.name.trim() || !feedbackForm.email.trim() || !feedbackForm.feedback.trim()) {
      setStatus('error');
      setErrorMsg('Please complete all fields (name, email, feedback).');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch(buildApiUrl('/feedback/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: feedbackForm.name.trim(),
          email: feedbackForm.email.trim(),
          feedback: feedbackForm.feedback.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setFeedbackForm({ name: '', email: '', feedback: '' });
        trackInteraction('feedback_submitted', feedbackForm.name.trim(), 'Footer');
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Failed to send feedback. Please try again.');
      }
    } catch (err) {
      console.error('Feedback Submission Error:', err);
      setStatus('error');
      setErrorMsg('Network error. Unable to send feedback.');
    }
  };

  return (
    <footer className="relative z-20 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-100/80 dark:bg-[#09090c] py-12 w-full">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="section-container space-y-10"
      >
        {/* Feedback Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121217] border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-zinc-800/80 pb-4">
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>Share Quick Feedback</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-white/60 font-mono mt-1">
                Have thoughts, suggestions, or spot a bug? Send feedback directly to my inbox.
              </p>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 self-start sm:self-auto">
              Direct Mail Delivered
            </span>
          </div>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-white/50 font-bold mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Alex Johnson"
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-white/50 font-bold mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="e.g., alex@company.com"
                  value={feedbackForm.email}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-500 dark:text-white/50 font-bold mb-1">
                Feedback / Comments
              </label>
              <textarea
                rows={3}
                placeholder="What did you like or think could be improved about this portfolio?"
                value={feedbackForm.feedback}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, feedback: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#09090b] border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
              />
            </div>

            {status === 'error' && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {status === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! Your feedback has been sent directly to Siva's email inbox.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-md active:scale-95 transition-all duration-200 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Feedback...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Main Footer Layout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-zinc-800/60">
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              VENKATA SIVA REDDY
            </h3>
            <p className="text-xs font-mono text-slate-600 dark:text-white/50">
              Full Stack Developer & Software Engineer · B.Tech CSE '27
            </p>
          </div>

          {/* Social Links & Scroll Top */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/vasanreddy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackInteraction('github_click', 'Footer GitHub', 'Footer')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/venkatasiva-reddy/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackInteraction('linkedin_click', 'Footer LinkedIn', 'Footer')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:vasanreddy1331@gmail.com"
              onClick={() => trackInteraction('email_click', 'Footer Email', 'Footer')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>

            <div className="w-px h-5 bg-slate-200 dark:bg-zinc-800 mx-1" />

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-xs font-mono text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 active:scale-95 transition-all duration-200 shadow-sm"
              aria-label="Back to top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500 dark:text-white/50">
          <span>© {new Date().getFullYear()} Venkata Siva Reddy. Personal Portfolio</span>
          <span>Andhra Pradesh, India</span>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
