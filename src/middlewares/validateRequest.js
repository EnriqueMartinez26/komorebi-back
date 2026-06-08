import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export function validateRequest(req, _res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return next(new ApiError(422, "Payload invalido.", result.array()));
  }

  return next();
}

