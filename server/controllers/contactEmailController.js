const { Resend } = require("resend");

// Helper to escape HTML characters in email content
function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * POST /api/contact/send
 * Sends contact form data to the portfolio owner's email using Resend API.
 * 
 * Works cleanly on cloud environments (like Render Free) where outbound SMTP ports are blocked.
 */
const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    // Check if Resend API key is present
    if (!process.env.RESEND_API_KEY) {
      console.error("[Resend Error] RESEND_API_KEY is not set in environment variables.");
      return res.status(500).json({
        success: false,
        message: "Email service is not configured on the server. Please contact directly at vasanthavenkatasiva@gmail.com."
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const toEmail = process.env.CONTACT_TO_EMAIL || "vasanthavenkatasiva@gmail.com";

    // Send email through Resend HTTP API
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [toEmail],
      subject: `Portfolio Contact: ${cleanSubject}`,
      replyTo: cleanEmail,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0; padding:0; background:#09090B; font-family:Arial, sans-serif; color:#FAFAFA;">
            <div style="max-width:650px; margin:30px auto; background:#18181B; border:1px solid #27272A; border-radius:16px; overflow:hidden;">
              <div style="padding:24px; background:#09090B; border-bottom:1px solid #27272A;">
                <h1 style="margin:0; color:#FAFAFA; font-size:24px;">New Portfolio Message</h1>
                <p style="margin:8px 0 0; color:#A1A1AA;">Someone contacted you through Siva Space Portfolio.</p>
              </div>

              <div style="padding:24px;">
                <p><strong style="color:#A1A1AA;">Name:</strong> <span style="color:#FAFAFA;">${escapeHtml(cleanName)}</span></p>
                <p><strong style="color:#A1A1AA;">Email:</strong> <span style="color:#06B6D4;">${escapeHtml(cleanEmail)}</span></p>
                <p><strong style="color:#A1A1AA;">Subject:</strong> <span style="color:#C084FC;">${escapeHtml(cleanSubject)}</span></p>

                <div style="margin-top:24px; padding:18px; background:#09090B; border-left:3px solid #8B5CF6; border-radius:8px;">
                  <p style="margin:0 0 8px 0; color:#A1A1AA; font-size:12px; font-weight:bold; letter-spacing:1px;">MESSAGE</p>
                  <p style="margin:0; color:#FAFAFA; line-height:1.7; white-space:pre-wrap;">${escapeHtml(cleanMessage)}</p>
                </div>
              </div>

              <div style="padding:18px 24px; border-top:1px solid #27272A; color:#71717A; font-size:12px; text-align:center;">
                Siva Space Portfolio Contact System · Reply directly to this email to respond to ${escapeHtml(cleanName)}
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error("[Resend Error]", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Email service failed. Please try again later."
      });
    }

    console.log("[Contact Email Sent]", data);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
      emailId: data?.id || null
    });

  } catch (error) {
    console.error("[Contact Controller Error]", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send message."
    });
  }
};

module.exports = {
  sendContactEmail
};
