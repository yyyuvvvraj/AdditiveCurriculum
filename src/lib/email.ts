import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST!;
const port = +(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER!;
const pass = process.env.SMTP_PASS!;
const from = process.env.SMTP_FROM || `no-reply@${process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "")}`;

if (!host || !user || !pass) {
  console.warn("SMTP not fully configured. Emails will fail unless configured.");
}

export async function sendResetEmail(to: string, resetUrl: string) {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  const subject = "Reset your Vasus Brake account password";
  const html = `
    <div style="font-family: system-ui, -apple-system, Roboto, 'Segoe UI', Roboto, Helvetica, Arial;">
      <h2>Reset your password</h2>
      <p>We received a request to reset the password for <strong>${to}</strong>.</p>
      <p>Click the link below to reset your password — this link expires in ${process.env.RESET_TOKEN_EXPIRY_MINUTES || 60} minutes.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:10px 14px;border-radius:6px;background:#6366f1;color:#fff;text-decoration:none;">Reset password</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
    </div>
  `;

  return transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}
