import { FavoriteService } from "../services/FavoriteService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class FavoriteController {
  constructor() {
    this.favoriteService = new FavoriteService();
  }

  list = asyncHandler(async (req, res) => {
    const items = await this.favoriteService.list(req.user.id);
    res.json({ items });
  });

  add = asyncHandler(async (req, res) => {
    const items = await this.favoriteService.add(req.user.id, req.params.productId);
    res.json({ message: "Favorito agregado.", items });
  });

  remove = asyncHandler(async (req, res) => {
    const items = await this.favoriteService.remove(
      req.user.id,
      req.params.productId
    );

    res.json({ message: "Favorito eliminado.", items });
  });
}

