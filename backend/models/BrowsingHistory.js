const mongoose = require("mongoose")

const browsingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  viewedAt: {
    type: Date,
    default: Date.now,
    expires: 2592000   // 30 days TTL
  }

})

browsingSchema.index({ userId: 1, productId: 1 }, { unique: true })
browsingSchema.index({ userId: 1, viewedAt: -1 })

module.exports = mongoose.model("BrowsingHistory", browsingSchema)