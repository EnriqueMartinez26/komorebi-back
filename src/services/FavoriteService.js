import { FavoriteRepository } from "../repositories/FavoriteRepository.js";
import { ProductRepository } from "../repositories/ProductRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { ProductDTO } from "../dtos/ProductDTO.js";

export class FavoriteService {
  constructor() {
    this.favoriteRepository = new FavoriteRepository();
    this.productRepository = new ProductRepository();
  }

  async list(userId) {
    const favorites = await this.favoriteRepository.model
      .find({ userId })
      .populate({
        path: "productId",
        populate: { path: "categoryId" }
      })
      .sort({ createdAt: -1 });

    return favorites
      .filter((favorite) => favorite.productId)
      .map((favorite) => ProductDTO.fromModel(favorite.productId));
  }

  async add(userId, productId) {
    const product = await this.productRepository.findById(productId);

    if (!product || !product.isActive) {
      throw new ApiError(404, "Producto inexistente.");
    }

    const existing = await this.favoriteRepository.findByUserAndProduct(
      userId,
      productId
    );

    if (!existing) {
      await this.favoriteRepository.create({ userId, productId });
    }

    return this.list(userId);
  }

  async remove(userId, productId) {
    await this.favoriteRepository.model.findOneAndDelete({ userId, productId });
    return this.list(userId);
  }
}

