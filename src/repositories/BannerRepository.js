import { BaseRepository } from "../classes/BaseRepository.js";
import { BannerModel } from "../models/Banner.js";

export class BannerRepository extends BaseRepository {
  constructor() {
    super(BannerModel);
  }
}

