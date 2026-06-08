import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// función para ver si tenemos las variables cargadas
function hasSmtpConfig() {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass);
}

// función para mandar un mail a través de SMTP
export async function sendMail({ to, subject, html }) {
  // si falta configurar SMTP, simulamos el envío para no romper nada en local
  if (!hasSmtpConfig()) {
    return {
      mocked: true,
      preview: { to, subject, html }
    };
  }

  // configuramos el transporte con nodemailer
  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  // enviamos el correo
  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    html
  });

  return { mocked: false };
}

