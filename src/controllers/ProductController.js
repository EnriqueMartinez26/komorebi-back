import { ProductService } from "../services/ProductService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  list = asyncHandler(async (req, res) => {
    const result = await this.productService.list(req.query);
    res.json(result);
  });

  featured = asyncHandler(async (req, res) => {
    const items = await this.productService.featured(req.query.limit);
    res.json({ items });
  });

  getBySlug = asyncHandler(async (req, res) => {
    const product = await this.productService.getBySlug(req.params.slug);
    res.json({ product });
  });

  search = asyncHandler(async (req, res) => {
    const result = await this.productService.search(
      req.query.q,
      req.query.page,
      req.query.limit
    );

    res.json(result);
  });
}

