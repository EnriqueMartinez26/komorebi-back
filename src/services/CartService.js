import { CartRepository } from "../repositories/CartRepository.js";
import { ProductRepository } from "../repositories/ProductRepository.js";
import { CartDTO } from "../dtos/CartDTO.js";
import { ApiError } from "../utils/ApiError.js";

export class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  async getCart(userId) {
    const cart = await this.ensureCart(userId);
    return CartDTO.fromModel(cart);
  }

  async addItem(userId, payload) {
    const cart = await this.ensureCart(userId);
    const product = await this.productRepository.findById(payload.productId);

    if (!product || !product.isActive) {
      throw new ApiError(404, "Producto inexistente.");
    }

    if (product.stock < payload.quantity) {
      throw new ApiError(400, "No hay stock suficiente.");
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === product._id.toString()
    );

    if (existingItem) {
      const requestedQuantity = existingItem.quantity + payload.quantity;

      if (product.stock < requestedQuantity) {
        throw new ApiError(400, "No hay stock suficiente.");
      }

      existingItem.quantity = requestedQuantity;
      existingItem.priceSnapshot = product.discountPrice || product.price;
    } else {
      cart.items.push({
        productId: product._id,
        quantity: payload.quantity,
        priceSnapshot: product.discountPrice || product.price,
        nameSnapshot: product.name,
        imageSnapshot: product.images[0] || ""
      });
    }

    this.recalculateCart(cart);
    await cart.save();

    const refreshed = await this.ensureCart(userId);
    return CartDTO.fromModel(refreshed);
  }

  async updateItem(userId, itemId, quantity) {
    const cart = await this.ensureCart(userId);
    const item = cart.items.id(itemId);

    if (!item) {
      throw new ApiError(404, "Item de carrito inexistente.");
    }

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      const product = await this.productRepository.findById(item.productId);

      if (!product || !product.isActive) {
        throw new ApiError(404, "Producto inexistente.");
      }

      if (product.stock < quantity) {
        throw new ApiError(400, "No hay stock suficiente.");
      }

      item.quantity = quantity;
      item.priceSnapshot = product.discountPrice || product.price;
    }

    this.recalculateCart(cart);
    await cart.save();

    const refreshed = await this.ensureCart(userId);
    return CartDTO.fromModel(refreshed);
  }

  async removeItem(userId, itemId) {
    const cart = await this.ensureCart(userId);
    const item = cart.items.id(itemId);

    if (!item) {
      throw new ApiError(404, "Item de carrito inexistente.");
    }

    item.deleteOne();
    this.recalculateCart(cart);
    await cart.save();

    const refreshed = await this.ensureCart(userId);
    return CartDTO.fromModel(refreshed);
  }

  async clear(userId) {
    const cart = await this.ensureCart(userId);
    cart.items = [];
    cart.total = 0;
    await cart.save();
    return CartDTO.fromModel(cart);
  }

  async ensureCart(userId) {
    let cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      cart = await this.cartRepository.create({ userId, items: [], total: 0 });
    }

    return cart;
  }

  recalculateCart(cart) {
    cart.total = cart.items.reduce(
      (accumulator, item) => accumulator + item.quantity * item.priceSnapshot,
      0
    );
  }
}

