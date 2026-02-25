const mongoose = require("mongoose");

const RecentlyViewedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
});

// prevent duplicates per user
RecentlyViewedSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("RecentlyViewed", RecentlyViewedSchema);