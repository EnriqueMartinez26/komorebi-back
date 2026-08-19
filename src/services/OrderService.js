import { OrderRepository } from "../repositories/OrderRepository.js";
import { ProductRepository } from "../repositories/ProductRepository.js";
import { CartService } from "./CartService.js";
import { ApiError } from "../utils/ApiError.js";

export class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
    this.cartService = new CartService();
  }

  async create(userId, payload) {
    const cart = await this.cartService.ensureCart(userId);

    if (!cart.items.length) {
      throw new ApiError(400, "El carrito esta vacio.");
    }

    const discounted = [];

    for (const item of cart.items) {
      const product = await this.productRepository.discountStock(
        item.productId,
        item.quantity
      );

      if (!product) {
        await this.restoreStock(discounted);
        throw new ApiError(400, await this.buildUnavailableMessage(item));
      }

      discounted.push(item);
    }

    let order;

    try {
      order = await this.orderRepository.create({
        userId,
        items: cart.items.map((item) => ({
          productId: item.productId,
          nameSnapshot: item.nameSnapshot,
          quantity: item.quantity,
          priceSnapshot: item.priceSnapshot
        })),
        amount: cart.total,
        paymentStatus: "pending",
        paymentMethod: payload.paymentMethod,
        shippingMethod: payload.shippingMethod,
        shippingAddress: payload.shippingAddress,
        orderStatus: "created"
      });

      cart.items = [];
      cart.total = 0;
      await cart.save();
    } catch (error) {
      await this.restoreStock(discounted);

      if (order) {
        await this.orderRepository.deleteById(order._id);
      }

      throw error;
    }

    return order;
  }

  async buildUnavailableMessage(item) {
    const product = await this.productRepository.findById(item.productId);

    if (!product || !product.isActive) {
      return `${item.nameSnapshot} ya no esta disponible.`;
    }

    return `No hay stock suficiente para ${item.nameSnapshot}.`;
  }

  async restoreStock(items) {
    for (const item of items) {
      await this.productRepository.restoreStock(item.productId, item.quantity);
    }
  }

  async list(userId) {
    return this.orderRepository
      .find({ userId })
      .sort({ createdAt: -1 });
  }

  async getById(userId, orderId) {
    const order = await this.orderRepository.findOne({ _id: orderId, userId });

    if (!order) {
      throw new ApiError(404, "Orden inexistente.");
    }

    return order;
  }
}

