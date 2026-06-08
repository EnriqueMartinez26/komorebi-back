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

    return {
      token: signAuthToken({ sub: user._id.toString() }),
      user: UserDTO.fromModel(user)
    };
  }

  async login(identifier, password) {
    const user = await this.userRepository.findByEmailOrUsername(identifier);

    if (!user) {
      throw new ApiError(404, "Usuario inexistente.");
    }

    const isValidPassword = await compareHash(password, user.passwordHash);

    if (!isValidPassword) {
      throw new ApiError(401, "Contrasena incorrecta.");
    }

    return {
      token: signAuthToken({ sub: user._id.toString() }),
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
      return {
        message:
          "Si el email existe, se envio un enlace para restablecer la contrasena."
      };
    }

    await this.passwordResetTokenRepository.model.deleteMany({
      userId: user._id
    });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

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
    await user.save();

    passwordReset.used = true;
    await passwordReset.save();

    return {
      message: "Contrasena actualizada correctamente."
    };
  }
}

