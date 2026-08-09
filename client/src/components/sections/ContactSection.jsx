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
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| API CONFIGURATION
|--------------------------------------------------------------------------
|
| client/.env
|
| VITE_API_URL=https://siva-space-api.onrender.com/api
|
| For local development you can use:
|
| VITE_API_URL=http://localhost:5000/api
|
| IMPORTANT:
| Restart Vite after changing .env
|
*/

const API_URL = (
  import.meta.env.VITE_API_URL || "/api"
).replace(/\/+$/, "");

const ContactSection = ({
  contacts = [],
  email = "vasanthavenkatasiva@gmail.com",
}) => {
  /*
  |--------------------------------------------------------------------------
  | FORM STATE
  |--------------------------------------------------------------------------
  */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  |
  | idle
  | loading
  | success
  | error
  |
  */

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  /*
  |--------------------------------------------------------------------------
  | HANDLE INPUT CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | HANDLE FORM SUBMISSION
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
    Prevent duplicate submissions
    */

    if (status === "loading") {
      return;
    }

    /*
    Basic frontend validation
    */

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

    /*
    |--------------------------------------------------------------------------
    | AbortController
    |--------------------------------------------------------------------------
    |
    | Render services can sometimes take time to wake up.
    | We therefore allow 60 seconds instead of 15 seconds.
    |
    */

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 60000);

    try {
      /*
      |--------------------------------------------------------------------------
      | FINAL API ENDPOINT
      |--------------------------------------------------------------------------
      |
      | Example:
      |
      | VITE_API_URL
      | https://siva-space-api.onrender.com/api
      |
      | endpoint
      | /contact/send
      |
      | Final URL:
      |
      | https://siva-space-api.onrender.com/api/contact/send
      |
      */

      const endpoint = `${API_URL}/contact/send`;

      console.log("=================================");
      console.log("CONTACT FORM REQUEST");
      console.log("API URL:", API_URL);
      console.log("Endpoint:", endpoint);
      console.log("=================================");

      /*
      |--------------------------------------------------------------------------
      | SEND REQUEST
      |--------------------------------------------------------------------------
      */

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

      /*
      | Request completed
      */

      clearTimeout(timeoutId);

      /*
      |--------------------------------------------------------------------------
      | READ RESPONSE
      |--------------------------------------------------------------------------
      */

      let data = {};

      const contentType =
        response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        data = {
          success: false,
          message:
            text ||
            `Server returned status ${response.status}.`,
        };
      }

      console.log("Contact API response:", data);

      /*
      |--------------------------------------------------------------------------
      | HTTP ERROR
      |--------------------------------------------------------------------------
      */

      if (!response.ok) {
        throw new Error(
          data.message ||
          `Server returned error ${response.status}.`
        );
      }

      /*
      |--------------------------------------------------------------------------
      | BACKEND SUCCESS
      |--------------------------------------------------------------------------
      */

      if (data.success === true) {
        setStatus("success");

        /*
        Clear form
        */

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        /*
        Return to idle state after 6 seconds
        */

        setTimeout(() => {
          setStatus("idle");
        }, 6000);

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | BACKEND RETURNED success:false
      |--------------------------------------------------------------------------
      */

      throw new Error(
        data.message ||
        "Unable to send your message. Please try again."
      );
    } catch (error) {
      console.error("Contact form error:", error);

      /*
      |--------------------------------------------------------------------------
      | TIMEOUT ERROR
      |--------------------------------------------------------------------------
      */

      if (error.name === "AbortError") {
        setErrorMsg(
          "The server took too long to respond. Render may be waking up. Please try again."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | CONNECTION ERROR
      |--------------------------------------------------------------------------
      */

      else if (
        error instanceof TypeError &&
        error.message === "Failed to fetch"
      ) {
        setErrorMsg(
          "Unable to connect to the server. Please check the backend connection and try again."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | OTHER ERROR
      |--------------------------------------------------------------------------
      */

      else {
        setErrorMsg(
          error.message ||
          "Something went wrong while sending your message."
        );
      }

      setStatus("error");
    } finally {
      clearTimeout(timeoutId);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CONTACT INFORMATION
  |--------------------------------------------------------------------------
  */

  const displayEmail =
    email || "vasanthavenkatasiva@gmail.com";

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden py-20 sm:py-24"
    >
      {/* ================================================================
          AMBIENT BACKGROUND
      ================================================================ */}

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        {/* Purple glow */}

        <div className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-[#8B5CF6]/[0.06] blur-3xl" />

        {/* Violet glow */}

        <div className="absolute bottom-[5%] right-[8%] h-80 w-80 rounded-full bg-[#A855F7]/[0.04] blur-3xl" />

        {/* Center glow */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.035),transparent_55%)]" />
      </div>

      {/* ================================================================
          MAIN CONTAINER
      ================================================================ */}

      <div className="relative mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ============================================================
              LEFT SIDE
          ============================================================ */}

          <div className="space-y-7 lg:col-span-5">
            {/* Section label */}

            <div className="inline-flex items-center gap-2 rounded-full border border-[#3F3F46] bg-[#18181B]/70 px-3 py-1.5 text-xs font-bold text-[#A1A1AA] backdrop-blur-md">
              <MessageSquare className="h-3.5 w-3.5 text-[#8B5CF6]" />

              <span>GET IN TOUCH</span>

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34D399]" />
            </div>

            {/* Heading */}

            <div>
              <h2 className="text-4xl font-black leading-[0.95] tracking-tight text-[#FAFAFA] sm:text-5xl lg:text-6xl">
                LET&apos;S BUILD
                <br />

                <span className="bg-gradient-to-r from-[#FAFAFA] via-[#C4B5FD] to-[#8B5CF6] bg-clip-text text-transparent">
                  SOMETHING USEFUL.
                </span>
              </h2>

              <div className="mt-5 h-px w-24 bg-gradient-to-r from-[#8B5CF6] to-transparent" />
            </div>

            {/* Description */}

            <p className="max-w-xl text-base leading-7 text-[#A1A1AA] sm:text-lg">
              Whether you have an internship opportunity, a software
              project, or want to discuss full-stack and AI engineering,
              drop a message.
            </p>

            {/* ==========================================================
                CONTACT INFORMATION
            ========================================================== */}

            <div className="space-y-3 pt-2">
              {/* EMAIL */}

              <a
                href={`mailto:${displayEmail}`}
                className="group flex items-center gap-4 rounded-2xl border border-[#27272A] bg-[#18181B]/55 p-4 backdrop-blur-md transition-all duration-300 hover:border-[#8B5CF6]/50 hover:bg-[#18181B]/80"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/10 text-[#8B5CF6] transition-all duration-300 group-hover:bg-[#8B5CF6]/15">
                  <Mail className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
                    Email
                  </span>

                  <span className="block truncate text-sm font-bold text-[#FAFAFA] transition-colors group-hover:text-[#C4B5FD]">
                    {displayEmail}
                  </span>
                </div>
              </a>

              {/* PHONE */}

              <a
                href="tel:+919502486918"
                className="group flex items-center gap-4 rounded-2xl border border-[#27272A] bg-[#18181B]/55 p-4 backdrop-blur-md transition-all duration-300 hover:border-[#7DD3FC]/40 hover:bg-[#18181B]/80"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#7DD3FC]/20 bg-[#7DD3FC]/10 text-[#7DD3FC] transition-all duration-300 group-hover:bg-[#7DD3FC]/15">
                  <Phone className="h-5 w-5" />
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
                    Phone
                  </span>

                  <span className="block text-sm font-bold text-[#FAFAFA] transition-colors group-hover:text-[#7DD3FC]">
                    +91 9502486918
                  </span>
                </div>
              </a>

              {/* LOCATION */}

              <div className="flex items-center gap-4 rounded-2xl border border-[#27272A] bg-[#18181B]/55 p-4 backdrop-blur-md">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#A855F7]/20 bg-[#A855F7]/10 text-[#A855F7]">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
                    Location
                  </span>

                  <span className="block text-sm font-bold text-[#FAFAFA]">
                    Andhra Pradesh, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              RIGHT SIDE — FORM
          ============================================================ */}

          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-[#27272A] bg-[#18181B]/65 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
              {/* Decorative top line */}

              <div
                className="pointer-events-none absolute right-0 top-0 h-px w-1/2 bg-gradient-to-l from-[#8B5CF6]/60 to-transparent"
                aria-hidden="true"
              />

              {/* Decorative bottom line */}

              <div
                className="pointer-events-none absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r from-[#A855F7]/50 to-transparent"
                aria-hidden="true"
              />

              {/* FORM HEADER */}

              <div className="mb-7 flex items-center justify-between gap-4">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#71717A]">
                    CONTACT PROTOCOL
                  </p>

                  <h3 className="flex items-center gap-2 text-xl font-bold text-[#FAFAFA] sm:text-2xl">
                    <Send className="h-5 w-5 text-[#8B5CF6]" />

                    <span>Send a Message</span>
                  </h3>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[#3F3F46] bg-[#09090B] sm:flex">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#34D399]" />
                </div>
              </div>

              {/* ========================================================
                  SUCCESS MESSAGE
              ======================================================== */}

              {status === "success" && (
                <div
                  role="status"
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-[#34D399]/30 bg-[#34D399]/10 p-5 text-[#34D399]"
                >
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />

                  <div>
                    <p className="font-bold">
                      Message sent successfully.
                    </p>

                    <p className="mt-1 text-sm text-[#A7F3D0]">
                      Thank you for reaching out. I&apos;ll get back to
                      you as soon as possible.
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================================
                  ERROR MESSAGE
              ======================================================== */}

              {status === "error" && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-400"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="font-bold">
                      Message could not be sent.
                    </p>

                    <p className="mt-1 text-sm leading-6 text-red-300/80">
                      {errorMsg}
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================================
                  FORM
              ======================================================== */}

              {status !== "success" && (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* NAME + EMAIL */}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* NAME */}

                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#A1A1AA]"
                      >
                        Your Name
                      </label>

                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        disabled={status === "loading"}
                        className="w-full rounded-xl border border-[#3F3F46] bg-[#09090B]/80 px-4 py-3.5 text-sm font-semibold text-[#FAFAFA] outline-none transition-all placeholder:text-[#52525B] focus:border-[#8B5CF6]/70 focus:ring-2 focus:ring-[#8B5CF6]/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                    {/* EMAIL */}

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#A1A1AA]"
                      >
                        Your Email
                      </label>

                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        disabled={status === "loading"}
                        className="w-full rounded-xl border border-[#3F3F46] bg-[#09090B]/80 px-4 py-3.5 text-sm font-semibold text-[#FAFAFA] outline-none transition-all placeholder:text-[#52525B] focus:border-[#8B5CF6]/70 focus:ring-2 focus:ring-[#8B5CF6]/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* SUBJECT */}

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#A1A1AA]"
                    >
                      Subject
                    </label>

                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Internship / Software Engineering Discussion"
                      disabled={status === "loading"}
                      className="w-full rounded-xl border border-[#3F3F46] bg-[#09090B]/80 px-4 py-3.5 text-sm font-semibold text-[#FAFAFA] outline-none transition-all placeholder:text-[#52525B] focus:border-[#8B5CF6]/70 focus:ring-2 focus:ring-[#8B5CF6]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* MESSAGE */}

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#A1A1AA]"
                    >
                      Message
                    </label>

                    <textarea
                      id="contact-message"
                      rows={6}
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi Venkata Siva Reddy, I'd like to discuss..."
                      disabled={status === "loading"}
                      className="w-full resize-none rounded-xl border border-[#3F3F46] bg-[#09090B]/80 px-4 py-3.5 text-sm font-semibold text-[#FAFAFA] outline-none transition-all placeholder:text-[#52525B] focus:border-[#8B5CF6]/70 focus:ring-2 focus:ring-[#8B5CF6]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* SUBMIT BUTTON */}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#8B5CF6] px-5 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.18)] transition-all duration-300 hover:bg-[#A855F7] hover:shadow-[0_0_35px_rgba(139,92,246,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />

                        <span>Connecting to Siva Space...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />

                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  {/* SECURITY NOTE */}

                  <p className="text-center text-xs leading-5 text-[#52525B]">
                    Your message is securely transmitted through the
                    portfolio contact service.
                  </p>
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