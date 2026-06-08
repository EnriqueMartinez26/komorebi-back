import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";

const router = Router();
const controller = new ProductController();

router.get("/", controller.list);
router.get("/featured", controller.featured);
router.get("/search", controller.search);
router.get("/:slug", controller.getBySlug);

export default router;

