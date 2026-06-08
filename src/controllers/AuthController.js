import { AuthService } from "../services/AuthService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  // manejador para registrar un usuario nuevo
  register = asyncHandler(async (req, res) => {
    const result = await this.authService.register(req.body);
    // metemos la cookie con el token
    this.setSessionCookie(res, result.token);

    res.status(201).json({
      message: "Registro exitoso.",
      user: result.user,
      token: result.token
    });
  });

  // manejador para iniciar sesión
  login = asyncHandler(async (req, res) => {
    const result = await this.authService.login(
      req.body.identifier,
      req.body.password
    );

    // guardamos la sesión en las cookies del cliente
    this.setSessionCookie(res, result.token);

    res.json({
      message: "Login exitoso.",
      user: result.user,
      token: result.token
    });
  });

  // manejador para cerrar la sesión
  logout = asyncHandler(async (_req, res) => {
    // borramos la cookie de sesión del navegador
    res.clearCookie(env.cookieName, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/"
    });

    res.json({ message: "Sesion cerrada." });
  });

  // manejador para cuando se olvidan la clave
  forgotPassword = asyncHandler(async (req, res) => {
    const result = await this.authService.forgotPassword(req.body.email);
    res.json(result);
  });

  // manejador para cambiar la contraseña usando el token
  resetPassword = asyncHandler(async (req, res) => {
    const result = await this.authService.resetPassword(
      req.body.token,
      req.body.password
    );

    res.json(result);
  });

  // obtenemos el perfil del usuario logueado actualmente
  me = asyncHandler(async (req, res) => {
    const user = await this.authService.getCurrentUser(req.user.id);
    res.json({ user });
  });

  // helper para setear la cookie de sesión con tiempo de expiración de 7 días
  setSessionCookie(res, token) {
    res.cookie(env.cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/"
    });
  }
}
