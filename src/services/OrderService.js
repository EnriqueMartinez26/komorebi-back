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

    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product || product.stock < item.quantity) {
        throw new ApiError(400, `No hay stock suficiente para ${item.nameSnapshot}.`);
      }

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await this.orderRepository.create({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId,
        nameSnapshot: item.nameSnapshot,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot
      })),
      amount: cart.total,
      paymentStatus: "pending",
      shippingMethod: payload.shippingMethod,
      shippingAddress: payload.shippingAddress,
      orderStatus: "created"
    });

    cart.items = [];
    cart.total = 0;
    await cart.save();

    return order;
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

