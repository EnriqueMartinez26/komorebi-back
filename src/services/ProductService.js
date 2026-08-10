import { ProductRepository } from "../repositories/ProductRepository.js";
import { ProductDTO } from "../dtos/ProductDTO.js";
import { ApiError } from "../utils/ApiError.js";
import { buildPagination, MAX_PAGE_LIMIT } from "../utils/pagination.js";

export class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async list(query = {}) {
    const pagination = buildPagination(query.page, query.limit);
    const filter = { isActive: true };

    if (query.categoryId) {
      filter.categoryId = query.categoryId;
    }

    if (query.featured === "true") {
      filter.featured = true;
    }

    const [products, total] = await Promise.all([
      this.productRepository.model
        .find(filter)
        .populate("categoryId")
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
      this.productRepository.count(filter)
    ]);

    return {
      items: products.map(ProductDTO.fromModel),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.max(Math.ceil(total / pagination.limit), 1)
      }
    };
  }

  async featured(limit = 8) {
    const safeLimit = Math.min(Math.max(Number(limit) || 8, 1), MAX_PAGE_LIMIT);

    const products = await this.productRepository.model
      .find({ isActive: true, featured: true })
      .populate("categoryId")
      .sort({ createdAt: -1 })
      .limit(safeLimit);

    return products.map(ProductDTO.fromModel);
  }

  async getBySlug(slug) {
    const product = await this.productRepository.model
      .findOne({ slug, isActive: true })
      .populate("categoryId");

    if (!product) {
      throw new ApiError(404, "Producto inexistente.");
    }

    return ProductDTO.fromModel(product);
  }

  async search(term, page = 1, limit = 12) {
    const normalizedTerm = term?.trim() || "destacados";
    const pagination = buildPagination(page, limit);

    const [products, total] = await Promise.all([
      this.productRepository.searchByTerm(normalizedTerm, {
        skip: pagination.skip,
        limit: pagination.limit
      }).populate("categoryId"),
      this.productRepository.model.countDocuments({
        isActive: true,
        $text: { $search: normalizedTerm }
      })
    ]);

    return {
      term: normalizedTerm,
      items: products.map(ProductDTO.fromModel),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.max(Math.ceil(total / pagination.limit), 1)
      }
    };
  }
}

