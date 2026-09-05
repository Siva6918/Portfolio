import React, { useState } from 'react';
import { ArrowUp, Github, Linkedin, Mail, MessageSquare, Send, CheckCircle2, Loader2, AlertCircle, Sparkles } from 'lucide-react';
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
    <footer className="relative z-20 footer-surface py-14 w-full transition-all duration-300">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        className="section-container space-y-8"
      >
        {/* 1. Feedback Section - Timeline Card Aesthetic */}
        <div
          className="relative rounded-3xl border overflow-hidden p-6 sm:p-8 transition-all duration-300"
          style={{
            background: 'rgba(9, 9, 11, 0.92)',
            borderColor: 'rgba(74, 222, 128, 0.45)',
            boxShadow: '0 8px 32px -6px rgba(74, 222, 128, 0.22), 0 0 20px rgba(0,0,0,0.5)',
          }}
        >
          {/* Top accent spark line */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(90deg, #4ade80, #38bdf8, #c084fc)',
            }}
          />

          {/* Feedback Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5 mb-6">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0"
                style={{
                  background: 'rgba(74, 222, 128, 0.16)',
                  borderColor: 'rgba(74, 222, 128, 0.45)',
                  boxShadow: '0 0 16px rgba(74, 222, 128, 0.25)',
                }}
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
              </div>

              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border mb-1"
                  style={{
                    background: 'rgba(74, 222, 128, 0.14)',
                    color: '#4ade80',
                    borderColor: 'rgba(74, 222, 128, 0.4)',
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>FEEDBACK BOX</span>
                </div>
                <h4
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  className="text-lg sm:text-xl font-bold text-white tracking-tight"
                >
                  Share Quick Feedback
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Thoughts, feature suggestions, or spotted a bug? Send feedback directly to my inbox.
                </p>
              </div>
            </div>

            <span
              className="text-[10px] font-mono px-3 py-1 rounded-full font-semibold border self-start sm:self-auto"
              style={{
                background: 'rgba(74, 222, 128, 0.12)',
                borderColor: 'rgba(74, 222, 128, 0.35)',
                color: '#4ade80',
                boxShadow: '0 0 12px rgba(74, 222, 128, 0.18)',
              }}
            >
              Direct Delivery
            </span>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 font-bold mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Alex Johnson"
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(18, 18, 24, 0.95)',
                    borderColor: 'rgba(63, 63, 70, 0.65)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#4ade80';
                    e.currentTarget.style.boxShadow = '0 0 16px rgba(74, 222, 128, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(63, 63, 70, 0.65)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 font-bold mb-1.5">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="e.g., alex@company.com"
                  value={feedbackForm.email}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(18, 18, 24, 0.95)',
                    borderColor: 'rgba(63, 63, 70, 0.65)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#4ade80';
                    e.currentTarget.style.boxShadow = '0 0 16px rgba(74, 222, 128, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(63, 63, 70, 0.65)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 font-bold mb-1.5">
                Feedback / Comments
              </label>
              <textarea
                rows={3}
                placeholder="What did you like or think could be improved about this portfolio?"
                value={feedbackForm.feedback}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, feedback: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-200 resize-none"
                style={{
                  background: 'rgba(18, 18, 24, 0.95)',
                  borderColor: 'rgba(63, 63, 70, 0.65)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#4ade80';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(74, 222, 128, 0.25)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(63, 63, 70, 0.65)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {status === 'error' && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {status === 'success' && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Thank you! Your feedback has been sent directly to Siva's inbox.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-mono text-xs font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #4ade80, #38bdf8)',
                boxShadow: '0 6px 24px -4px rgba(74, 222, 128, 0.4)',
              }}
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

        {/* 2. Main Footer Card */}
        <div
          className="relative rounded-3xl border p-6 sm:p-8 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 shadow-xl"
          style={{
            background: 'rgba(9, 9, 11, 0.90)',
            borderColor: 'rgba(63, 63, 70, 0.65)',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Top subtle accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{
              background: 'linear-gradient(90deg, #38bdf8, #c084fc, transparent 70%)',
            }}
          />

          <div className="space-y-1.5">
            <h3
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2.5"
            >
              <span>VENKATA SIVA REDDY</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-400">
                PORTFOLIO
              </span>
            </h3>
            <p className="text-xs font-mono text-zinc-400">
              Full Stack Developer & Software Engineer · B.Tech CSE (2023 - 2027)
            </p>
          </div>

          {/* Social Links & Scroll Top with Timeline Card Aesthetic */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/vasanreddy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackInteraction('github_click', 'Footer GitHub', 'Footer')}
              className="group p-3 rounded-xl border text-zinc-400 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(18, 18, 24, 0.9)',
                borderColor: 'rgba(63, 63, 70, 0.65)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#38bdf8';
                e.currentTarget.style.boxShadow = '0 0 18px rgba(56, 189, 248, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(63, 63, 70, 0.65)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>

            <a
              href="https://www.linkedin.com/in/venkatasiva-reddy/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackInteraction('linkedin_click', 'Footer LinkedIn', 'Footer')}
              className="group p-3 rounded-xl border text-zinc-400 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(18, 18, 24, 0.9)',
                borderColor: 'rgba(63, 63, 70, 0.65)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0ea5e9';
                e.currentTarget.style.boxShadow = '0 0 18px rgba(14, 165, 233, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(63, 63, 70, 0.65)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>

            <a
              href="mailto:vasanreddy1331@gmail.com"
              onClick={() => trackInteraction('email_click', 'Footer Email', 'Footer')}
              className="group p-3 rounded-xl border text-zinc-400 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(18, 18, 24, 0.9)',
                borderColor: 'rgba(63, 63, 70, 0.65)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#c084fc';
                e.currentTarget.style.boxShadow = '0 0 18px rgba(192, 132, 252, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(63, 63, 70, 0.65)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label="Email"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>

            <div className="w-px h-5 bg-zinc-800 mx-1" />

            <button
              onClick={scrollToTop}
              className="group flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-mono font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'rgba(18, 18, 24, 0.9)',
                borderColor: 'rgba(74, 222, 128, 0.45)',
                boxShadow: '0 0 14px rgba(74, 222, 128, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4ade80';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.45)';
                e.currentTarget.style.boxShadow = '0 0 14px rgba(74, 222, 128, 0.15)';
              }}
              aria-label="Back to top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* 3. Bottom Credits */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500">
          <span>© {new Date().getFullYear()} Venkata Siva Reddy. Personal Portfolio</span>
          <span>RGMCET · Andhra Pradesh, India</span>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
