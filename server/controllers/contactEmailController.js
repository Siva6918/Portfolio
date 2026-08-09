const nodemailer = require('nodemailer');

/**
 * POST /api/contact/send
 * Sends contact form data to the portfolio owner's email.
 * 
 * Uses explicit Gmail SMTP config (smtp.gmail.com:465) instead of
 * `service: 'gmail'` shorthand — this is more reliable on cloud
 * platforms like Render, Railway, Vercel serverless, etc.
 */
const sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  // Verify SMTP credentials are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('[Contact Email Error] SMTP_USER or SMTP_PASS not configured in environment variables.');
    return res.status(500).json({ success: false, message: 'Email service is not configured. Please contact directly at vasanthavenkatasiva@gmail.com.' });
  }

  try {
    // Explicit Gmail SMTP configuration — works reliably on Render, Railway, etc.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: true, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      // Render/cloud platform DNS resolution can be slow — increase timeouts
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });

    // Verify the transporter connection first
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error('[SMTP Verify Error]', verifyErr.message);
      return res.status(500).json({
        success: false,
        message: 'Email server connection failed. Please contact directly at vasanthavenkatasiva@gmail.com.'
      });
    }

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #09090b; color: #fafafa; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #27272a;">
        <div style="border-bottom: 1px solid #27272a; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="color: #6366f1; font-size: 22px; margin: 0;">📬 New Portfolio Contact Message</h1>
          <p style="color: #a1a1aa; font-size: 12px; margin: 6px 0 0; font-family: monospace;">Received via SIVA SPACE Portfolio</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 10px 0; color: #a1a1aa; font-weight: bold; width: 100px; vertical-align: top; font-family: monospace; font-size: 11px; text-transform: uppercase;">Name</td>
            <td style="padding: 10px 0; color: #fafafa; font-weight: 600;">${name}</td>
          </tr>
          <tr style="border-top: 1px solid #27272a;">
            <td style="padding: 10px 0; color: #a1a1aa; font-weight: bold; vertical-align: top; font-family: monospace; font-size: 11px; text-transform: uppercase;">Email</td>
            <td style="padding: 10px 0; color: #06b6d4;">${email}</td>
          </tr>
          <tr style="border-top: 1px solid #27272a;">
            <td style="padding: 10px 0; color: #a1a1aa; font-weight: bold; vertical-align: top; font-family: monospace; font-size: 11px; text-transform: uppercase;">Subject</td>
            <td style="padding: 10px 0; color: #c084fc; font-weight: 600;">${subject}</td>
          </tr>
          <tr style="border-top: 1px solid #27272a;">
            <td style="padding: 10px 0; color: #a1a1aa; font-weight: bold; vertical-align: top; font-family: monospace; font-size: 11px; text-transform: uppercase;">Message</td>
            <td style="padding: 10px 0; color: #fafafa; line-height: 1.7; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding: 14px; background: #18181b; border-radius: 10px; border: 1px solid #27272a; font-size: 12px; color: #a1a1aa; font-family: monospace;">
          <strong style="color: #6366f1;">Reply directly</strong> to this email to respond to ${name} at: <strong style="color: #06b6d4;">${email}</strong>
        </div>

        <p style="margin-top: 20px; font-size: 11px; color: #52525b; font-family: monospace; text-align: center;">
          SIVA SPACE Portfolio · vasanthavenkatasiva@gmail.com · +91 9502486918
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"SIVA SPACE Portfolio" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO_EMAIL || 'vasanthavenkatasiva@gmail.com',
      replyTo: email,
      subject: `[Portfolio Contact] ${subject}`,
      html: htmlBody,
      text: `New Portfolio Message\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    });

    res.status(200).json({ success: true, message: 'Message sent successfully! I will get back to you soon.' });
  } catch (err) {
    console.error('[Contact Email Error]', err.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again or contact directly at vasanthavenkatasiva@gmail.com.' });
  }
};

module.exports = { sendContactEmail };
