import crypto from "node:crypto";
import { UserRepository } from "../repositories/UserRepository.js";
import { CartRepository } from "../repositories/CartRepository.js";
import { PasswordResetTokenRepository } from "../repositories/PasswordResetTokenRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { compareHash, hashValue } from "../utils/hash.js";
import { signAuthToken } from "../utils/jwt.js";
import { UserDTO } from "../dtos/UserDTO.js";
import { sendMail } from "../utils/mailer.js";
import { env } from "../config/env.js";

export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.cartRepository = new CartRepository();
    this.passwordResetTokenRepository = new PasswordResetTokenRepository();
  }

  // método para registrar usuarios nuevos
  async register(payload) {
    const email = payload.email.toLowerCase();
    const username = payload.username.toLowerCase();

    // nos fijamos si ya existe alguien con el mismo mail o username
    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.findByEmail(email),
      this.userRepository.findByUsername(username)
    ]);

    if (existingEmail) {
      throw new ApiError(409, "El email ya esta registrado.");
    }

    if (existingUsername) {
      throw new ApiError(409, "El username ya esta registrado.");
    }

    // encriptamos la contraseña usando bcrypt
    const passwordHash = await hashValue(payload.password);

    // creamos el usuario en la base de datos
    const user = await this.userRepository.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      username,
      email,
      passwordHash
    });

    // le creamos un carrito vacío asociado a su ID de una vez
    const cart = await this.cartRepository.create({
      userId: user._id,
      items: [],
      total: 0
    });

    user.cartId = cart._id;
    await user.save();

    // Enviamos el mail de bienvenida de forma asíncrona
    sendMail({
      to: user.email,
      subject: "¡Bienvenido a Komorebi Spa & Deco!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #faf8f6; color: #333;">
          <h2 style="color: #b07d62; text-align: center; margin-bottom: 20px;">¡Te damos la bienvenida a Komorebi!</h2>
          <p>Hola <strong>${user.firstName}</strong>,</p>
          <p>¡Gracias por registrarte en nuestra tienda! Tu cuenta se creó con éxito.</p>
          <p>Ya podés empezar a explorar nuestra selección exclusiva de productos Japandi, kits de baño, y accesorios de decoración pensados para armonizar tu hogar.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${env.clientUrl}" style="background-color: #b07d62; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Ir a la Tienda</a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 11px; color: #999; text-align: center; margin-top: 20px;">Este es un correo automático de Komorebi. No respondas a este mensaje.</p>
        </div>
      `
    }).catch(error => {
      console.error("Error al enviar mail de bienvenida:", error);
    });

    // devolvemos el token jwt firmado y los datos del usuario formateados
    return {
      token: signAuthToken({ sub: user._id.toString() }),
      user: UserDTO.fromModel(user)
    };
  }

  // método para iniciar sesión
  async login(identifier, password) {
    // buscamos por email o nombre de usuario
    const user = await this.userRepository.findByEmailOrUsername(identifier);

    if (!user) {
      throw new ApiError(404, "Usuario inexistente.");
    }

    // comparamos los hashes de las contraseñas
    const isValidPassword = await compareHash(password, user.passwordHash);

    if (!isValidPassword) {
      throw new ApiError(401, "Contrasena incorrecta.");
    }

    return {
      token: signAuthToken({ sub: user._id.toString() }),
      user: UserDTO.fromModel(user)
    };
  }

  // método para traer el usuario actual con su id
  async getCurrentUser(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "Usuario no encontrado.");
    }

    return UserDTO.fromModel(user);
  }

  // método para mandar el mail de recuperación de clave
  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);

    // si no existe el mail no tiramos error para que no adivinen emails registrados
    if (!user) {
      return {
        message:
          "Si el email existe, se envio un enlace para restablecer la contrasena."
      };
    }

    // borramos tokens viejos si quedaron dando vueltas
    await this.passwordResetTokenRepository.model.deleteMany({
      userId: user._id
    });

    // generamos un token random para la url
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // vence en 30 min

    await this.passwordResetTokenRepository.create({
      userId: user._id,
      token: hashedToken,
      expiresAt,
      used: false
    });

    const resetUrl = `${env.clientUrl}/forgot-password?token=${rawToken}`;

    // mandamos el mail con el enlace de restauración
    await sendMail({
      to: user.email,
      subject: "Recuperacion de contrasena",
      html: `
        <p>Hola ${user.firstName},</p>
        <p>Hace click en el siguiente enlace para restablecer tu contrasena:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>El enlace vence en 30 minutos.</p>
      `
    });

    return {
      message:
        "Si el email existe, se envio un enlace para restablecer la contrasena."
    };
  }

  // método para pisar la contraseña vieja con la nueva usando el token
  async resetPassword(token, password) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // buscamos que el token exista, no esté usado y no haya expirado
    const passwordReset = await this.passwordResetTokenRepository.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!passwordReset) {
      throw new ApiError(400, "El token de recuperacion es invalido o expiro.");
    }

    const user = await this.userRepository.findById(passwordReset.userId);

    if (!user) {
      throw new ApiError(404, "Usuario no encontrado.");
    }

    // encriptamos la nueva contraseña y guardamos
    user.passwordHash = await hashValue(password);
    await user.save();

    // invalidamos el token usado
    passwordReset.used = true;
    await passwordReset.save();

    return {
      message: "Contrasena actualizada correctamente."
    };
  }
}

