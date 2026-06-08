import { UserRepository } from "../repositories/UserRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyAuthToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

const userRepository = new UserRepository();

export async function authMiddleware(req, _res, next) {
  try {
    const bearerToken = req.headers.authorization?.replace("Bearer ", "");
    const cookieToken = req.cookies?.[env.cookieName];
    const token = bearerToken || cookieToken;

    if (!token) {
      return next(new ApiError(401, "Sesion requerida."));
    }

    const payload = verifyAuthToken(token);
    const user = await userRepository.findById(payload.sub);

    if (!user) {
      return next(new ApiError(401, "Sesion invalida."));
    }

    req.user = {
      id: user._id.toString(),
      role: user.role
    };

    return next();
  } catch (_error) {
    return next(new ApiError(401, "Sesion invalida."));
  }
}

