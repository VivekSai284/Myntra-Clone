const mongoose = require("mongoose");

const BagItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

    size: { type: String, required: true },

    quantity: { type: Number, required: true },

    priceAtTime: { type: Number, required: true }, // snapshot price

    status: {
      type: String,
      enum: ["ACTIVE", "SAVED"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

// prevent duplicate same product + size for same user
BagItemSchema.index({ userId: 1, productId: 1, size: 1, status: 1 }, { unique: true });

module.exports = mongoose.model("Bag", BagItemSchema);