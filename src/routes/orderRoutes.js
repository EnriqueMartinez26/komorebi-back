import { Router } from "express";
import { OrderController } from "../controllers/OrderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createOrderValidator } from "../validators/orderValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = Router();
const controller = new OrderController();

router.use(authMiddleware);
router.post("/", createOrderValidator, validateRequest, controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getById);

export default router;

