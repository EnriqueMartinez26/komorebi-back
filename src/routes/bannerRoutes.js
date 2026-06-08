import { Router } from "express";
import { BannerController } from "../controllers/BannerController.js";

const router = Router();
const controller = new BannerController();

router.get("/", controller.list);

export default router;

