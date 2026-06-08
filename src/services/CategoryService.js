import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { ApiError } from "../utils/ApiError.js";

export class CategoryService {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async list() {
    const categories = await this.categoryRepository
      .find({ isActive: true })
      .sort({ name: 1 });

    return categories;
  }

  async getBySlug(slug) {
    const category = await this.categoryRepository.findOne({
      slug,
      isActive: true
    });

    if (!category) {
      throw new ApiError(404, "Categoria inexistente.");
    }

    return category;
  }
}

