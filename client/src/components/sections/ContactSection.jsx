import React, { useState } from "react";
import { Mail, Linkedin, Github, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAnalytics } from "../../context/AnalyticsContext";

const easeCurve = [0.16, 1, 0.3, 1];
const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

const ContactSection = ({ email = "vasanreddy1331@gmail.com", profile = {} }) => {
  const { trackInteraction } = useAnalytics();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === "loading") return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setStatus("error");
      setErrorMsg("Please fill in all fields.");
      return;
    }

    trackInteraction('contact_form_submit', formData.subject.trim() || 'Contact Form', 'Contact');

    setStatus("loading");
    setErrorMsg("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const endpoint = `${API_URL}/contact/send`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data = {};
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { success: true };
      }

      if (response.ok || data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 6000);
        return;
      }

      throw new Error(data.message || "Failed to send message");
    } catch (error) {
      console.error("Contact submit error:", error);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const displayEmail = email || profile?.email || "vasanreddy1331@gmail.com";

  return (
    <section id="contact" className="py-20 relative w-full border-t border-slate-200 dark:border-zinc-800/60">
      <div className="section-container">
        
        {/* Header Stagger */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.0, ease: easeCurve }}
              className="text-xs font-mono tracking-widest text-indigo-600 dark:text-indigo-400 uppercase font-semibold block"
            >
              09 // GET IN TOUCH
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1"
            >
              Have an idea, opportunity, or interesting problem?
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
            className="text-xs font-mono text-slate-600 dark:text-white/50 max-w-xs"
          >
            Feel free to drop a message or reach out directly on LinkedIn / Email.
          </motion.p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Links */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.0, ease: easeCurve }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="editorial-card p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                DIRECT CONTACT
              </h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${displayEmail}`}
                  onClick={() => trackInteraction('email_click', displayEmail, 'Contact')}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-white/70 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm"
                >
                  <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-mono text-slate-500 dark:text-white/50 uppercase">Email</span>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">{displayEmail}</span>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/venkatasiva-reddy/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackInteraction('linkedin_click', 'LinkedIn Profile', 'Contact')}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-white/70 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm"
                >
                  <Linkedin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-mono text-slate-500 dark:text-white/50 uppercase">LinkedIn</span>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">linkedin.com/in/venkatasiva-reddy</span>
                  </div>
                </a>

                <a
                  href="https://github.com/vasanreddy"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackInteraction('github_click', 'GitHub Profile', 'Contact')}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-white/70 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm"
                >
                  <Github className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-mono text-slate-500 dark:text-white/50 uppercase">GitHub</span>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">github.com/vasanreddy</span>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.15, ease: easeCurve }}
            className="lg:col-span-7"
          >
            <div className="editorial-card p-6 sm:p-8 space-y-4">
              
              {status === "success" && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-xs font-mono animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-3 text-xs font-mono animate-fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {status !== "success" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-mono text-slate-700 dark:text-white/70 mb-1">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        disabled={status === "loading"}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors duration-200 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-mono text-slate-700 dark:text-white/70 mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        disabled={status === "loading"}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors duration-200 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-mono text-slate-700 dark:text-white/70 mb-1">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Role Discussion / Project Opportunity"
                      disabled={status === "loading"}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors duration-200 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-mono text-slate-700 dark:text-white/70 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi Venkata Siva Reddy..."
                      disabled={status === "loading"}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors duration-200 disabled:opacity-50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-mono text-xs font-semibold shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND MESSAGE</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;