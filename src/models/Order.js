import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    nameSnapshot: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    priceSnapshot: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: {
      type: [orderItemSchema],
      default: []
    },
    amount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      default: "pending"
    },
    shippingMethod: {
      type: String,
      default: "standard"
    },
    shippingAddress: {
      type: String,
      required: true
    },
    orderStatus: {
      type: String,
      default: "created"
    }
  },
  {
    timestamps: true
  }
);

export const OrderModel = mongoose.model("Order", orderSchema);

