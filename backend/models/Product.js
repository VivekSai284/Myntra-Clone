const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    brand: String,
    category: {
      type: String,
      required: true,
      enum: ["men", "women", "kids", "beauty"],
      index: true,
    },
    price: Number,
    discount: String,
    description: String,
    sizes: [String],
    images: [String],

    // 🔥 ADD THESE
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    popularityScore: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true },
);

ProductSchema.index({ name: "text", brand: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ popularityScore: -1 });

module.exports = mongoose.model("Product", ProductSchema);
