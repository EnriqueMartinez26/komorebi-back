import { Router } from "express";
import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import favoriteRoutes from "./favoriteRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import contactRoutes from "./contactRoutes.js";
import bannerRoutes from "./bannerRoutes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/contact", contactRoutes);
router.use("/banners", bannerRoutes);

export default router;

