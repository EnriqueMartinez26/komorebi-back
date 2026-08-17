import { AuthService } from "../services/AuthService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: env.isProduction ? "none" : "lax",
  secure: env.isProduction,
  path: "/"
};

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req, res) => {
    const result = await this.authService.register(req.body);

    res.status(201).json({
      message: "Registro exitoso.",
      user: result.user,
      token: result.token
    });
  });

  login = asyncHandler(async (req, res) => {
    const result = await this.authService.login(
      req.body.identifier,
      req.body.password
    );

    res.json({
      message: "Login exitoso.",
      user: result.user,
      token: result.token
    });
  });

  logout = asyncHandler(async (_req, res) => {
    res.clearCookie(env.cookieName, SESSION_COOKIE_OPTIONS);

    res.json({ message: "Sesion cerrada." });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const result = await this.authService.forgotPassword(req.body.email);
    res.json(result);
  });

  resetPassword = asyncHandler(async (req, res) => {
    const result = await this.authService.resetPassword(
      req.body.token,
      req.body.password
    );

    res.json(result);
  });

  me = asyncHandler(async (req, res) => {
    const user = await this.authService.getCurrentUser(req.user.id);
    res.json({ user });
  });
}
