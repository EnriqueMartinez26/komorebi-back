import { BaseRepository } from "../classes/BaseRepository.js";
import { CartModel } from "../models/Cart.js";

export class CartRepository extends BaseRepository {
  constructor() {
    super(CartModel);
  }

  findByUserId(userId) {
    return this.findOne({ userId }).populate("items.productId");
  }
}

