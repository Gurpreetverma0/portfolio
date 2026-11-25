import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export const isEmailConfigured = () => {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass && env.smtp.notifyEmail);
};

export const sendContactNotification = async ({ name, email, subject, message }) => {
  if (!isEmailConfigured()) return { sent: false, reason: 'SMTP not configured' };

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${env.smtp.user}>`,
    to: env.smtp.notifyEmail,
    replyTo: email,
    subject: `[Portfolio Inquiry] ${subject}`,
    text: `New message from ${name} (${email}):\n\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="margin-top:0;color:#111827;">New Portfolio Contact Message</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
        <p style="white-space:pre-line;color:#374151;">${message}</p>
      </div>
    `,
  });

  return { sent: true };
};
