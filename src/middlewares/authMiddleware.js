import { UserRepository } from "../repositories/UserRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyAuthToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

const userRepository = new UserRepository();

// middleware para verificar si el usuario inició sesión
export async function authMiddleware(req, _res, next) {
  try {
    // busco el token en los headers (Bearer) o en la cookie de sesion
    const bearerToken = req.headers.authorization?.replace("Bearer ", "");
    const cookieToken = req.cookies?.[env.cookieName];
    const token = bearerToken || cookieToken;

    // si no hay token, lo reboto sin vueltas
    if (!token) {
      return next(new ApiError(401, "Sesion requerida."));
    }

    // verifico que el token sea valido y busco el usuario en la BD
    const payload = verifyAuthToken(token);
    const user = await userRepository.findById(payload.sub);

    // si el usuario no existe en la base, no lo dejo pasar
    if (!user) {
      return next(new ApiError(401, "Sesion invalida."));
    }

    // guardo el id y el rol en el request para tenerlo a mano en los controladores
    req.user = {
      id: user._id.toString(),
      role: user.role
    };

    return next();
  } catch (_error) {
    // cualquier fallo con el token se va directo a error 401
    return next(new ApiError(401, "Sesion invalida."));
  }
}

