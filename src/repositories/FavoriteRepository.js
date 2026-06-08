import { BaseRepository } from "../classes/BaseRepository.js";
import { FavoriteModel } from "../models/Favorite.js";

export class FavoriteRepository extends BaseRepository {
  constructor() {
    super(FavoriteModel);
  }

  findByUserAndProduct(userId, productId) {
    return this.findOne({ userId, productId });
  }
}

