import { sendMail } from "../utils/mailer.js";
import { escapeHtml } from "../utils/escapeHtml.js";
import { env } from "../config/env.js";

export class ContactService {
  async send(payload) {
    await sendMail({
      to: env.contactEmail,
      subject: `Consulta de ${payload.name}`,
      html: `
        <p>Nombre: ${escapeHtml(payload.name)}</p>
        <p>Email: ${escapeHtml(payload.email)}</p>
        <p>Mensaje:</p>
        <p>${escapeHtml(payload.message)}</p>
      `
    });

    return {
      message: "Consulta enviada correctamente."
    };
  }
}

