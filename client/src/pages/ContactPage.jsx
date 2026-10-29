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
        {/* Tactical Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marigold/10 border border-marigold/30 text-marigold text-xs font-mono mb-4">
          <Mail className="w-3.5 h-3.5 text-marigold" />
          <span className="tracking-widest uppercase font-bold">COMMUNICATIONS BEACON // DIRECT CHANNEL</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold font-grotesk text-white mb-4">
          Get in{' '}
          <span className="bg-gradient-to-r from-marigold via-neonRose to-iceSilver bg-clip-text text-transparent">
            Touch
          </span>
        </h1>
        <p className="text-iceSilver-dark text-base sm:text-lg mb-12 font-mono leading-relaxed">
          Whether you want to discuss full-stack opportunities, collaborate on an AI or web project, or recruit a clutch shot-caller for your team, my direct communications channel is always open.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={100}>
        <form onSubmit={handleSubmit} className="space-y-8 border-t border-[#242834] pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">Your Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#101016] border border-[#242834] text-iceSilver px-4 py-3 font-mono text-sm rounded-xl focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold/30 transition-all placeholder:text-zinc-600"
                placeholder="Alan Turing"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">Your Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#101016] border border-[#242834] text-iceSilver px-4 py-3 font-mono text-sm rounded-xl focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold/30 transition-all placeholder:text-zinc-600"
                placeholder="alan@enigma.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">Message</label>
            <textarea 
              required
              rows={6}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full bg-[#101016] border border-[#242834] text-iceSilver px-4 py-3 font-mono text-sm rounded-xl focus:outline-none focus:border-marigold focus:ring-1 focus:ring-marigold/30 transition-all placeholder:text-zinc-600 resize-none"
              placeholder="Tell me about your project, team mission, or inquiry..."
            />
          </div>

          {status === 'error' && (
            <div className="text-neonRose font-mono text-sm uppercase tracking-wider bg-neonRose/10 border border-neonRose/30 p-4 rounded-xl">{errorMsg}</div>
          )}

          {status === 'success' && (
            <div className="text-emerald-400 font-mono text-sm uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">Message successfully transmitted. I will respond within 24 hours!</div>
          )}

          <button 
            type="submit" 
            disabled={status === 'loading'} 
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-black transition-all duration-200 shadow-lg hover:shadow-marigold/20 hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f43f5e)' }}
          >
            {status === 'loading' ? 'TRANSMITTING...' : 'DISPATCH MESSAGE'}
          </button>
        </form>
      </RevealOnScroll>
    </div>
  );
};

export default ContactPage;
