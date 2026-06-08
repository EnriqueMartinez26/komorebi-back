import { sendMail } from "../utils/mailer.js";
import { env } from "../config/env.js";

export class ContactService {
  async send(payload) {
    await sendMail({
      to: env.contactEmail,
      subject: `Consulta de ${payload.name}`,
      html: `
        <p>Nombre: ${payload.name}</p>
        <p>Email: ${payload.email}</p>
        <p>Mensaje:</p>
        <p>${payload.message}</p>
      `
    });

    return {
      message: "Consulta enviada correctamente."
    };
  }
}

