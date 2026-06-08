import { BannerService } from "../services/BannerService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class BannerController {
  constructor() {
    this.bannerService = new BannerService();
  }

  list = asyncHandler(async (req, res) => {
    const items = await this.bannerService.list(req.query.position);
    res.json({ items });
  });
}

