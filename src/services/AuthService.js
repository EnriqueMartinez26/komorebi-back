import crypto from "node:crypto";
import { UserRepository } from "../repositories/UserRepository.js";
import { CartRepository } from "../repositories/CartRepository.js";
import { PasswordResetTokenRepository } from "../repositories/PasswordResetTokenRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { compareHash, hashValue } from "../utils/hash.js";
import { signAuthToken } from "../utils/jwt.js";
import { UserDTO } from "../dtos/UserDTO.js";
import { sendMail } from "../utils/mailer.js";
import { escapeHtml } from "../utils/escapeHtml.js";
import { env } from "../config/env.js";

const RESET_TOKEN_TTL_MS = 1000 * 60 * 30;
const RESET_REQUEST_MESSAGE =
  "Si el email existe, se envio un enlace para restablecer la contrasena.";
const INVALID_CREDENTIALS_MESSAGE = "Credenciales invalidas.";
const DECOY_PASSWORD_HASH =
  "$2b$10$XoawIpF5knhK/v7AkjNn1O8GHBP2a4bOBBa5cDrt9rmW/OghHDnLW";

export class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.cartRepository = new CartRepository();
    this.passwordResetTokenRepository = new PasswordResetTokenRepository();
  }

  async register(payload) {
    const email = payload.email.toLowerCase();
    const username = payload.username.toLowerCase();

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

    const passwordHash = await hashValue(payload.password);

    const user = await this.userRepository.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      username,
      email,
      passwordHash
    });

    const cart = await this.cartRepository.create({
      userId: user._id,
      items: [],
      total: 0
    });

    user.cartId = cart._id;
    await user.save();

    sendMail({
      to: user.email,
      subject: "¡Bienvenido a Komorebi Spa & Deco!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #faf8f6; color: #333;">
          <h2 style="color: #b07d62; text-align: center; margin-bottom: 20px;">¡Te damos la bienvenida a Komorebi!</h2>
          <p>Hola <strong>${escapeHtml(user.firstName)}</strong>,</p>
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

    return {
      token: signAuthToken({
        sub: user._id.toString(),
        tokenVersion: user.tokenVersion ?? 0
      }),
      user: UserDTO.fromModel(user)
    };
  }

  async login(identifier, password) {
    const user = await this.userRepository.findByEmailOrUsername(identifier);
    const isValidPassword = await compareHash(
      password,
      user?.passwordHash || DECOY_PASSWORD_HASH
    );

    if (!user || !isValidPassword) {
      throw new ApiError(401, INVALID_CREDENTIALS_MESSAGE);
    }

    return {
      token: signAuthToken({
        sub: user._id.toString(),
        tokenVersion: user.tokenVersion ?? 0
      }),
      user: UserDTO.fromModel(user)
    };
  }

  async getCurrentUser(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "Usuario no encontrado.");
    }

    return UserDTO.fromModel(user);
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return { message: RESET_REQUEST_MESSAGE };
    }

    await this.passwordResetTokenRepository.model.deleteMany({
      userId: user._id
    });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await this.passwordResetTokenRepository.create({
      userId: user._id,
      token: hashedToken,
      expiresAt,
      used: false
    });

    const resetUrl = `${env.clientUrl}/forgot-password?token=${rawToken}`;

    await sendMail({
      to: user.email,
      subject: "Recuperacion de contrasena",
      html: `
        <p>Hola ${escapeHtml(user.firstName)},</p>
        <p>Hace click en el siguiente enlace para restablecer tu contrasena:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>El enlace vence en 30 minutos.</p>
      `
    });

    return { message: RESET_REQUEST_MESSAGE };
  }

  async resetPassword(token, password) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

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

    user.passwordHash = await hashValue(password);
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    await user.save();

    passwordReset.used = true;
    await passwordReset.save();

    return {
      message: "Contrasena actualizada correctamente."
    };
  }
}

