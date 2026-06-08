import { BaseRepository } from "../classes/BaseRepository.js";
import { OrderModel } from "../models/Order.js";

export class OrderRepository extends BaseRepository {
  constructor() {
    super(OrderModel);
  }
}

