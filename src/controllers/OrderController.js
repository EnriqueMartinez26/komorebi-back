import { OrderService } from "../services/OrderService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  create = asyncHandler(async (req, res) => {
    const order = await this.orderService.create(req.user.id, req.body);
    res.status(201).json({ message: "Orden creada.", order });
  });

  list = asyncHandler(async (req, res) => {
    const items = await this.orderService.list(req.user.id);
    res.json({ items });
  });

  getById = asyncHandler(async (req, res) => {
    const order = await this.orderService.getById(req.user.id, req.params.id);
    res.json({ order });
  });
}

