import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { ApiError } from "./ApiError.js";

export const MAIL_SERVICE_UNAVAILABLE_MESSAGE =
  "No se pudo enviar el mail porque el servicio de correo no esta disponible.";

export function isMailerConfigured() {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass);
}

export async function sendMail({ to, subject, html }) {
  if (!isMailerConfigured()) {
    if (env.isProduction) {
      throw new ApiError(503, MAIL_SERVICE_UNAVAILABLE_MESSAGE);
    }

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

