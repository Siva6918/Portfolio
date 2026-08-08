import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const ContactSection = ({ contacts = [], email = 'vasanthavenkatasiva@gmail.com' }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const res = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        setErrorMsg(data.message || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setErrorMsg('Request timed out. Please try again.');
      } else {
        setErrorMsg('Could not reach server. Make sure the backend is running on port 5000.');
      }
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 relative w-full bg-transparent">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121217] border border-[#2d2d3a] text-[#06b6d4] text-xs font-mono font-bold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-extrabold text-[#fafafa] leading-tight tracking-tight">
              LET'S BUILD <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] via-[#c084fc] to-[#06b6d4]">
                SOMETHING USEFUL.
              </span>
            </h2>

            <p className="text-[#a1a1aa] text-base leading-relaxed max-w-md font-medium">
              Whether you have an internship opportunity, a software project, or want to discuss full-stack &amp; AI engineering, drop a message!
            </p>

            {/* Contact Cards */}
            <div className="space-y-3 pt-2">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 p-4 rounded-2xl glass-card hover:border-[#6366f1] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 text-[#6366f1] flex items-center justify-center border border-[#6366f1]/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold uppercase text-[#a1a1aa]">Email</span>
                  <span className="text-sm font-bold text-[#fafafa] group-hover:text-[#6366f1] transition-colors">
                    {email}
                  </span>
                </div>
              </a>

              <a
                href="tel:+919502486918"
                className="flex items-center gap-3 p-4 rounded-2xl glass-card hover:border-[#06b6d4] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center border border-[#06b6d4]/20">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold uppercase text-[#a1a1aa]">Phone</span>
                  <span className="text-sm font-bold text-[#fafafa] group-hover:text-[#06b6d4] transition-colors">
                    +91 9502486918
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-4 rounded-2xl glass-card">
                <div className="w-10 h-10 rounded-xl bg-[#c084fc]/10 text-[#c084fc] flex items-center justify-center border border-[#c084fc]/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-bold uppercase text-[#a1a1aa]">Location</span>
                  <span className="text-sm font-bold text-[#fafafa]">
                    Andhra Pradesh, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 rounded-3xl border border-[#2d2d3a] shadow-2xl space-y-6">
              <h3 className="text-xl font-bold text-[#fafafa] flex items-center gap-2">
                <Send className="w-5 h-5 text-[#6366f1]" />
                <span>Send a Message</span>
              </h3>

              {/* Success State */}
              {status === 'success' && (
                <div className="p-5 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] flex items-center gap-3 text-sm font-semibold">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <span>Message sent! I'll get back to you at <strong>{formData.email || 'your email'}</strong> soon.</span>
                </div>
              )}

              {/* Error State */}
              {status === 'error' && (
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 text-sm font-semibold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              {status !== 'success' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#a1a1aa] font-bold mb-1.5">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#2d2d3a] text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/40 focus:border-[#6366f1] text-sm font-semibold transition-colors placeholder:text-[#52525b]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#a1a1aa] font-bold mb-1.5">Your Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#2d2d3a] text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/40 focus:border-[#6366f1] text-sm font-semibold transition-colors placeholder:text-[#52525b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a1a1aa] font-bold mb-1.5">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Internship / Software Engineering Discussion"
                      className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#2d2d3a] text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/40 focus:border-[#6366f1] text-sm font-semibold transition-colors placeholder:text-[#52525b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a1a1aa] font-bold mb-1.5">Message</label>
                    <textarea
                      rows={5}
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi Venkata Siva Reddy, I'd like to discuss..."
                      className="w-full px-4 py-3 rounded-xl bg-[#09090b] border border-[#2d2d3a] text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/40 focus:border-[#6366f1] text-sm font-semibold transition-colors resize-none placeholder:text-[#52525b]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#6366f1] hover:bg-[#c084fc] text-[#fafafa] font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
