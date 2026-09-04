import React, { useState } from "react";
import { Mail, Linkedin, Github, Send, CheckCircle2, Loader2, AlertCircle, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "../common/SectionHeader";
import { useAnalytics } from "../../context/AnalyticsContext";
import { API_BASE } from "../../services/api";

const easeCurve = [0.16, 1, 0.3, 1];
const API_URL = API_BASE.replace(/\/+$/, "");

const ContactSection = ({ email = "vasanreddy1331@gmail.com", profile = {} }) => {
  const { trackInteraction } = useAnalytics();

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [freelanceData, setFreelanceData] = useState({
    name: "", email: "", phone: "", company: "", projectTitle: "", description: "",
    requiredSkills: "", expectedDuration: "", budget: "", currency: "USD",
    startDate: "", additionalRequirements: ""
  });

  const [contactStatus, setContactStatus] = useState("idle");
  const [contactError, setContactError] = useState("");

  const [freelanceStatus, setFreelanceStatus] = useState("idle");
  const [freelanceError, setFreelanceError] = useState("");

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFreelanceChange = (e) => {
    const { name, value } = e.target;
    setFreelanceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (contactStatus === "loading") return;

    if (!contactData.name.trim() || !contactData.email.trim() || !contactData.subject.trim() || !contactData.message.trim()) {
      setContactStatus("error");
      setContactError("Please fill in all required fields.");
      return;
    }

    trackInteraction('contact_form_submit', contactData.subject.trim() || 'Contact Form', 'Contact');
    setContactStatus("loading");
    setContactError("");

    try {
      const response = await fetch(`${API_URL}/contact/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(contactData),
      });

      const data = response.headers.get("content-type")?.includes("application/json") ? await response.json() : { success: true };

      if (response.ok || data.success) {
        setContactStatus("success");
        setContactData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setContactStatus("idle"), 6000);
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact submit error:", error);
      setContactStatus("error");
      setContactError(error.message || "Something went wrong.");
      setTimeout(() => setContactStatus("idle"), 6000);
    }
  };

  const handleFreelanceSubmit = async (e) => {
    e.preventDefault();
    if (freelanceStatus === "loading") return;

    if (!freelanceData.name.trim() || !freelanceData.email.trim() || !freelanceData.projectTitle.trim() || !freelanceData.description.trim() || !freelanceData.requiredSkills.trim() || !freelanceData.expectedDuration.trim() || !freelanceData.budget.trim() || !freelanceData.startDate.trim()) {
      setFreelanceStatus("error");
      setFreelanceError("Please fill in all required fields.");
      return;
    }

    trackInteraction('freelance_form_submit', freelanceData.projectTitle.trim() || 'Freelance Form', 'Contact');
    setFreelanceStatus("loading");
    setFreelanceError("");

    try {
      const response = await fetch(`${API_URL}/contact/freelance`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(freelanceData),
      });

      const data = response.headers.get("content-type")?.includes("application/json") ? await response.json() : { success: true };

      if (response.ok || data.success) {
        setFreelanceStatus("success");
        setFreelanceData({ name: "", email: "", phone: "", company: "", projectTitle: "", description: "", requiredSkills: "", expectedDuration: "", budget: "", currency: "USD", startDate: "", additionalRequirements: "" });
        setTimeout(() => setFreelanceStatus("idle"), 6000);
      } else {
        throw new Error(data.message || "Failed to send opportunity");
      }
    } catch (error) {
      console.error("Freelance submit error:", error);
      setFreelanceStatus("error");
      setFreelanceError(error.message || "Something went wrong.");
      setTimeout(() => setFreelanceStatus("idle"), 6000);
    }
  };

  const displayEmail = email || profile?.email || "vasanreddy1331@gmail.com";

  return (
    <section id="contact" className="py-24 relative w-full border-t border-slate-200 dark:border-zinc-800/60 overflow-hidden">
      <div className="section-container">
        
        {/* Header with Color-Sparked Card Pill & Space Grotesk */}
        <SectionHeader
          badgeText="09 // GET IN TOUCH & COLLABORATE"
          icon={Mail}
          color="#c084fc"
          title="Have an idea, opportunity, or "
          gradientTitle="interesting problem?"
          description="Open to software engineering internships, technical collaborations, and select freelance opportunities."
        />

        {/* 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Direct Contact */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.0, ease: easeCurve }}
            className="space-y-6"
          >
            <div className="rounded-2xl border h-full space-y-5 p-6 overflow-hidden transition-all duration-300"
              style={{ background: "rgba(9,9,11,0.88)", borderColor: "rgba(63,63,70,0.65)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#fb7185"; e.currentTarget.style.boxShadow = "0 10px 36px -6px rgba(251,113,133,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.65)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="h-0.5 -mx-6 -mt-6 mb-5" style={{ background: "linear-gradient(90deg,#fb7185,transparent 70%)" }} />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border" style={{ background: "#fb718516", color: "#fb7185", borderColor: "#fb718535" }}>
                  DIRECT
                </span>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wide">
                  Contact Information
                </h3>
              </div>
              <div className="space-y-4">
                <a href={`mailto:${displayEmail}`} onClick={() => trackInteraction('email_click', displayEmail, 'Contact')}
                   className="flex items-center gap-3.5 p-3.5 rounded-xl border text-zinc-300 hover:text-white transition-all duration-200" style={{background:"rgba(63,63,70,0.3)",borderColor:"rgba(63,63,70,0.5)"}}>
                  <Mail className="w-4 h-4 shrink-0" style={{color:"#fb7185"}} />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-mono uppercase" style={{color:"rgba(161,161,170,0.7)"}}>Email</span>
                    <span className="block text-xs font-bold text-white truncate">{displayEmail}</span>
                  </div>
                </a>
                <a href="https://www.linkedin.com/in/venkatasiva-reddy/" target="_blank" rel="noreferrer" onClick={() => trackInteraction('linkedin_click', 'LinkedIn Profile', 'Contact')}
                   className="flex items-center gap-3.5 p-3.5 rounded-xl border text-zinc-300 hover:text-white transition-all duration-200" style={{background:"rgba(63,63,70,0.3)",borderColor:"rgba(63,63,70,0.5)"}}>
                  <Linkedin className="w-4 h-4 shrink-0" style={{color:"#fb7185"}} />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-mono uppercase" style={{color:"rgba(161,161,170,0.7)"}}>LinkedIn</span>
                    <span className="block text-xs font-bold text-white truncate">linkedin.com/in/venkatasiva-reddy</span>
                  </div>
                </a>
                <a href="https://github.com/vasanreddy" target="_blank" rel="noreferrer" onClick={() => trackInteraction('github_click', 'GitHub Profile', 'Contact')}
                   className="flex items-center gap-3.5 p-3.5 rounded-xl border text-zinc-300 hover:text-white transition-all duration-200" style={{background:"rgba(63,63,70,0.3)",borderColor:"rgba(63,63,70,0.5)"}}>
                  <Github className="w-4 h-4 shrink-0" style={{color:"#fb7185"}} />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-mono uppercase" style={{color:"rgba(161,161,170,0.7)"}}>GitHub</span>
                    <span className="block text-xs font-bold text-white truncate">github.com/vasanreddy</span>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
            id="contact-me-form"
          >
            <div className="rounded-2xl border h-full space-y-4 p-6 overflow-hidden transition-all duration-300"
              style={{ background: "rgba(9,9,11,0.88)", borderColor: "rgba(63,63,70,0.65)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#c084fc"; e.currentTarget.style.boxShadow = "0 10px 36px -6px rgba(192,132,252,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.65)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="h-0.5 -mx-6 -mt-6 mb-4" style={{ background: "linear-gradient(90deg,#c084fc,transparent 70%)" }} />
              <h3 className="text-base font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" /> Contact Me
              </h3>
              
              {contactStatus === "success" && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-xs font-mono animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Message sent successfully!</span>
                </div>
              )}
              {contactStatus === "error" && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-3 text-xs font-mono animate-fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{contactError}</span>
                </div>
              )}

              {contactStatus !== "success" && (
                <form onSubmit={handleContactSubmit} className="space-y-4 flex flex-col h-[calc(100%-3rem)]">
                  <div className="space-y-3 flex-grow">
                    <div>
                      <input type="text" name="name" required value={contactData.name} onChange={handleContactChange} placeholder="Name" disabled={contactStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                    </div>
                    <div>
                      <input type="email" name="email" required value={contactData.email} onChange={handleContactChange} placeholder="Email" disabled={contactStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                    </div>
                    <div>
                      <input type="text" name="subject" required value={contactData.subject} onChange={handleContactChange} placeholder="Subject" disabled={contactStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                    </div>
                    <div>
                      <textarea name="message" required rows={4} value={contactData.message} onChange={handleContactChange} placeholder="Message" disabled={contactStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors resize-none" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                    </div>
                  </div>
                  <button type="submit" disabled={contactStatus === "loading"} className="w-full mt-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-mono text-xs font-semibold shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50" style={{background:"linear-gradient(135deg,#fb7185,#c084fc)",boxShadow:"0 6px 24px rgba(251,113,133,0.28)"}}>
                    {contactStatus === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{contactStatus === "loading" ? "SENDING..." : "SEND MESSAGE"}</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Column 3: Freelance Opportunity Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeCurve }}
            id="freelance-form"
          >
            <div className="rounded-2xl border h-full space-y-4 p-6 overflow-hidden transition-all duration-300"
              style={{ background: "rgba(9,9,11,0.88)", borderColor: "rgba(63,63,70,0.65)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.boxShadow = "0 10px 36px -6px rgba(74,222,128,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.65)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="h-0.5 -mx-6 -mt-6 mb-4" style={{ background: "linear-gradient(90deg,#4ade80,transparent 70%)" }} />
              <h3 className="text-base font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" /> Freelance Opportunity
              </h3>
              
              {freelanceStatus === "success" && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-xs font-mono animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Opportunity submitted! I'll be in touch soon.</span>
                </div>
              )}
              {freelanceStatus === "error" && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-3 text-xs font-mono animate-fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{freelanceError}</span>
                </div>
              )}

              {freelanceStatus !== "success" && (
                <form onSubmit={handleFreelanceSubmit} className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" name="name" required value={freelanceData.name} onChange={handleFreelanceChange} placeholder="Name *" disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                    <input type="email" name="email" required value={freelanceData.email} onChange={handleFreelanceChange} placeholder="Email *" disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" name="phone" value={freelanceData.phone} onChange={handleFreelanceChange} placeholder="Phone (opt)" disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                    <input type="text" name="company" value={freelanceData.company} onChange={handleFreelanceChange} placeholder="Company (opt)" disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                  </div>
                  <input type="text" name="projectTitle" required value={freelanceData.projectTitle} onChange={handleFreelanceChange} placeholder="Project Title *" disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                  <textarea name="description" required rows={2} value={freelanceData.description} onChange={handleFreelanceChange} placeholder="Project Description *" disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors resize-none" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                  <input type="text" name="requiredSkills" required value={freelanceData.requiredSkills} onChange={handleFreelanceChange} placeholder="Required Skills (e.g., React, Node) *" disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" name="expectedDuration" required value={freelanceData.expectedDuration} onChange={handleFreelanceChange} placeholder="Duration (e.g. 2 mos) *" disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                    <input type="text" name="startDate" required value={freelanceData.startDate} onChange={handleFreelanceChange} placeholder="Start Date *" disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                  </div>
                  
                  <div className="grid grid-cols-[2fr_1fr] gap-3">
                    <input type="text" name="budget" required value={freelanceData.budget} onChange={handleFreelanceChange} placeholder="Budget / Hourly Rate *" disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                    <select name="currency" value={freelanceData.currency} onChange={handleFreelanceChange} disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                      <option value="AUD">AUD</option>
                    </select>
                  </div>
                  <input type="text" name="additionalRequirements" value={freelanceData.additionalRequirements} onChange={handleFreelanceChange} placeholder="Additional Requirements (opt)" disabled={freelanceStatus === "loading"} className="w-full px-4 py-2.5 rounded-xl text-xs font-mono text-white focus:outline-none transition-colors" style={{background:"rgba(24,24,27,0.95)",border:"1px solid rgba(63,63,70,0.6)"}} />
                  
                  <button type="submit" disabled={freelanceStatus === "loading"} className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-semibold shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50" style={{background:"linear-gradient(135deg,#4ade80,#2dd4bf)",color:"#000",boxShadow:"0 6px 24px rgba(74,222,128,0.25)"}}>
                    {freelanceStatus === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />}
                    <span>{freelanceStatus === "loading" ? "SUBMITTING..." : "SUBMIT OPPORTUNITY"}</span>
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

