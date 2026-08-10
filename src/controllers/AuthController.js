import { AuthService } from "../services/AuthService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

const SESSION_COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req, res) => {
    const result = await this.authService.register(req.body);
    this.setSessionCookie(res, result.token);

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

    this.setSessionCookie(res, result.token);

    res.json({
      message: "Login exitoso.",
      user: result.user,
      token: result.token
    });
  });

  logout = asyncHandler(async (_req, res) => {
    res.clearCookie(env.cookieName, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/"
    });

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

  setSessionCookie(res, token) {
    res.cookie(env.cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: SESSION_COOKIE_MAX_AGE_MS,
      path: "/"
    });
  }
}
