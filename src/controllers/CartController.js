import { CartService } from "../services/CartService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  get = asyncHandler(async (req, res) => {
    const cart = await this.cartService.getCart(req.user.id);
    res.json({ cart });
  });

  addItem = asyncHandler(async (req, res) => {
    const cart = await this.cartService.addItem(req.user.id, req.body);
    res.json({ message: "Producto agregado al carrito.", cart });
  });

  updateItem = asyncHandler(async (req, res) => {
    const cart = await this.cartService.updateItem(
      req.user.id,
      req.params.itemId,
      req.body.quantity
    );

    res.json({ message: "Carrito actualizado.", cart });
  });

  removeItem = asyncHandler(async (req, res) => {
    const cart = await this.cartService.removeItem(req.user.id, req.params.itemId);
    res.json({ message: "Producto eliminado del carrito.", cart });
  });

  clear = asyncHandler(async (req, res) => {
    const cart = await this.cartService.clear(req.user.id);
    res.json({ message: "Carrito vaciado.", cart });
  });
}

