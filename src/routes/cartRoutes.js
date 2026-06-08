import { Router } from "express";
import { CartController } from "../controllers/CartController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addCartItemValidator,
  updateCartItemValidator
} from "../validators/cartValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = Router();
const controller = new CartController();

router.use(authMiddleware);
router.get("/", controller.get);
router.post("/items", addCartItemValidator, validateRequest, controller.addItem);
router.patch(
  "/items/:itemId",
  updateCartItemValidator,
  validateRequest,
  controller.updateItem
);
router.delete("/items/:itemId", controller.removeItem);
router.delete("/", controller.clear);

export default router;

