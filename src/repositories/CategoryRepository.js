import { BaseRepository } from "../classes/BaseRepository.js";
import { CategoryModel } from "../models/Category.js";

export class CategoryRepository extends BaseRepository {
  constructor() {
    super(CategoryModel);
  }
}

