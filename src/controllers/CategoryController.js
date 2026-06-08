import { CategoryService } from "../services/CategoryService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  list = asyncHandler(async (_req, res) => {
    const items = await this.categoryService.list();
    res.json({ items });
  });

  getBySlug = asyncHandler(async (req, res) => {
    const category = await this.categoryService.getBySlug(req.params.slug);
    res.json({ category });
  });
}

