import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    priceSnapshot: {
      type: Number,
      required: true
    },
    nameSnapshot: {
      type: String,
      required: true
    },
    imageSnapshot: {
      type: String,
      default: ""
    }
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    items: {
      type: [cartItemSchema],
      default: []
    },
    total: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const CartModel = mongoose.model("Cart", cartSchema);

