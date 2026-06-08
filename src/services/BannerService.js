import { BannerRepository } from "../repositories/BannerRepository.js";

export class BannerService {
  constructor() {
    this.bannerRepository = new BannerRepository();
  }

  async list(position) {
    const filter = { isActive: true };

    if (position) {
      filter.position = position;
    }

    return this.bannerRepository.find(filter).sort({ createdAt: -1 });
  }
}

