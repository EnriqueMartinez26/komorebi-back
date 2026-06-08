import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator
} from "../validators/authValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
const controller = new AuthController();

router.post("/register", registerValidator, validateRequest, controller.register);
router.post("/login", loginValidator, validateRequest, controller.login);
router.post("/logout", controller.logout);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validateRequest,
  controller.forgotPassword
);
router.post(
  "/reset-password",
  resetPasswordValidator,
  validateRequest,
  controller.resetPassword
);
router.get("/me", authMiddleware, controller.me);

export default router;

