import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Linkedin,
  Github,
  FileText
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "/api"
).replace(/\/+$/, "");

const ContactSection = ({
  email = "vasanreddy1331@gmail.com",
  profile = {}
}) => {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === "loading") return;

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setStatus("error");
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 60000);

    try {
      const endpoint = `${API_URL}/contact/send`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
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
        const text = await response.text();
        data = {
          success: false,
          message: text || `Server returned status ${response.status}.`,
        };
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Server returned error ${response.status}.`
        );
      }

      if (data.success === true) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        setTimeout(() => {
          setStatus("idle");
        }, 6000);

        return;
      }

      throw new Error(
        data.message || "Unable to send your message. Please try again."
      );
    } catch (error) {
      console.error("Contact form error:", error);

      if (error.name === "AbortError") {
        setErrorMsg(
          "The server took too long to respond. Render may be waking up. Please try again."
        );
      } else if (
        error instanceof TypeError &&
        error.message === "Failed to fetch"
      ) {
        setErrorMsg(
          "Unable to connect to the server. Please check the backend connection and try again."
        );
      } else {
        setErrorMsg(
          error.message || "Something went wrong while sending your message."
        );
      }

      setStatus("error");
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const displayEmail = email || profile?.email || "vasanreddy1331@gmail.com";

  return (
    <section id="contact" className="py-16 relative w-full">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Info & CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1]">
                <MessageSquare className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-xs uppercase font-mono font-semibold tracking-widest text-[#a5b4fc]">
                  Get In Touch
                </h2>
                <h3 className="text-2xl font-bold text-[#fafafa]">
                  Let's Connect
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#a1a1aa] leading-relaxed">
              Available for software engineering roles, internships, and technical discussions. Drop me a message directly or reach out via email/LinkedIn.
            </p>

            {/* Quick Contact Info */}
            <div className="space-y-2.5 pt-2">
              <a
                href={`mailto:${displayEmail}`}
                className="glass-card p-4 rounded-xl flex items-center gap-3.5 group hover:border-[#6366f1]/40 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono text-[#52525b] uppercase">Email</span>
                  <span className="block text-xs font-semibold text-[#fafafa] group-hover:text-[#a5b4fc] truncate transition-colors">
                    {displayEmail}
                  </span>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/venkatasiva-reddy/"
                target="_blank"
                rel="noreferrer"
                className="glass-card p-4 rounded-xl flex items-center gap-3.5 group hover:border-[#6366f1]/40 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center text-[#06b6d4] shrink-0">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono text-[#52525b] uppercase">LinkedIn</span>
                  <span className="block text-xs font-semibold text-[#fafafa] group-hover:text-[#06b6d4] truncate transition-colors">
                    linkedin.com/in/venkatasiva-reddy
                  </span>
                </div>
              </a>

              <a
                href="https://github.com/vasanreddy"
                target="_blank"
                rel="noreferrer"
                className="glass-card p-4 rounded-xl flex items-center gap-3.5 group hover:border-[#6366f1]/40 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6] shrink-0">
                  <Github className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono text-[#52525b] uppercase">GitHub</span>
                  <span className="block text-xs font-semibold text-[#fafafa] group-hover:text-[#c4b5fd] truncate transition-colors">
                    github.com/vasanreddy
                  </span>
                </div>
              </a>
            </div>

          </div>

          {/* Right Column: Clean Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-7 rounded-xl border border-[#27272a]">
              
              {status === "success" && (
                <div className="p-4 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Message sent successfully.</p>
                    <p className="text-xs text-[#a7f3d0] mt-1">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 text-sm mb-4">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Message could not be sent.</p>
                    <p className="text-xs text-red-300 mt-1">{errorMsg}</p>
                  </div>
                </div>
              )}

              {status !== "success" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-mono text-[#a1a1aa] mb-1.5 font-medium">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        disabled={status === "loading"}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181b] border border-[#27272a] text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1] disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-mono text-[#a1a1aa] mb-1.5 font-medium">
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        disabled={status === "loading"}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181b] border border-[#27272a] text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1] disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-mono text-[#a1a1aa] mb-1.5 font-medium">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Internship / Role Discussion"
                      disabled={status === "loading"}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181b] border border-[#27272a] text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-mono text-[#a1a1aa] mb-1.5 font-medium">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi Venkata Siva Reddy, I'd like to connect regarding..."
                      disabled={status === "loading"}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181b] border border-[#27272a] text-sm text-[#fafafa] placeholder:text-[#52525b] focus:outline-none focus:border-[#6366f1] disabled:opacity-50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#7c3aed] transition-colors disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending message...</span>
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