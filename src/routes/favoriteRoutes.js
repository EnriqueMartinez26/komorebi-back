import { Router } from "express";
import { FavoriteController } from "../controllers/FavoriteController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
const controller = new FavoriteController();

router.use(authMiddleware);
router.get("/", controller.list);
router.post("/:productId", controller.add);
router.delete("/:productId", controller.remove);

export default router;

