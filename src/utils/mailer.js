import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function hasSmtpConfig() {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass);
}

export async function sendMail({ to, subject, html }) {
  if (!hasSmtpConfig()) {
    return {
      mocked: true,
      preview: { to, subject, html }
    };
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    html
  });

  return { mocked: false };
}

