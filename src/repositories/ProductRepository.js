import { BaseRepository } from "../classes/BaseRepository.js";
import { ProductModel } from "../models/Product.js";

export class ProductRepository extends BaseRepository {
  constructor() {
    super(ProductModel);
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  searchByTerm(term, options) {
    return this.model.find(
      {
        isActive: true,
        $text: { $search: term }
      },
      { score: { $meta: "textScore" } },
      options
    ).sort({ score: { $meta: "textScore" } });
  }
}

