import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../services/api';
import RevealOnScroll from '../components/common/RevealOnScroll';
import { Mail } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = "Contact | Venkata Siva Reddy";
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch(buildApiUrl('/contact/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Failed to send message.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Unable to send message.');
    }
  };

  return (
    <div className="section-container pt-32 max-w-3xl">
      <RevealOnScroll className="animate-fade-up">
        <h1 className="text-4xl sm:text-5xl font-bold font-grotesk text-white mb-12 flex items-center gap-4">
          <Mail className="w-8 h-8 text-editorial-accent" /> Contact
        </h1>
        <p className="text-editorial-textMain text-lg mb-16 leading-relaxed">
          Whether you have a question, an opportunity, or just want to say hi, my inbox is always open. I'll try my best to get back to you!
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={100}>
        <form onSubmit={handleSubmit} className="space-y-8 border-t border-editorial-border pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-mono text-editorial-textMuted uppercase tracking-widest mb-3">Your Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="form-input"
                placeholder="Alan Turing"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-editorial-textMuted uppercase tracking-widest mb-3">Your Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="form-input"
                placeholder="alan@enigma.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-editorial-textMuted uppercase tracking-widest mb-3">Message</label>
            <textarea 
              required
              rows={6}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="form-input resize-none"
              placeholder="What's on your mind?"
            />
          </div>

          {status === 'error' && (
            <div className="text-editorial-accent font-mono text-sm uppercase tracking-wider bg-editorial-accent/10 border border-editorial-accent/20 p-4 rounded-md">{errorMsg}</div>
          )}

          {status === 'success' && (
            <div className="text-[#4ade80] font-mono text-sm uppercase tracking-wider bg-[#4ade80]/10 border border-[#4ade80]/20 p-4 rounded-md">Message successfully delivered. Thank you!</div>
          )}

          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full sm:w-auto">
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </RevealOnScroll>
    </div>
  );
};

export default ContactPage;
