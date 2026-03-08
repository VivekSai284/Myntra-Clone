const Product = require("../models/Product")
const BrowsingHistory = require("../models/BrowsingHistory")
const Wishlist = require("../models/Wishlist")
const mongoose = require("mongoose")

exports.getRecommendations = async (userId, currentProductId) => {

  const currentProduct = await Product.findById(currentProductId)
  if (!currentProduct) return []

  const objectUserId = new mongoose.Types.ObjectId(userId)
  const objectProductId = new mongoose.Types.ObjectId(currentProductId)

  // Last 10 browsing history
  const browsing = await BrowsingHistory
    .find({ userId })
    .sort({ viewedAt: -1 })
    .limit(10)
    .select("productId")

  const viewedIds = browsing.map(b => b.productId)

  // Users who wishlisted this product
  const similarUsers = await Wishlist
    .find({ productId: objectProductId })
    .select("userId")

  const similarUserIds = similarUsers.map(u => u.userId)

  const recommendations = await Product.aggregate([

    {
      $match: {
        _id: { $ne: objectProductId },
        isActive: true
      }
    },

    {
      $lookup: {
        from: "wishlists",
        localField: "_id",
        foreignField: "productId",
        as: "wishlistUsers"
      }
    },

    {
      $addFields: {

        categoryScore: {
          $cond: [
            { $eq: ["$category", currentProduct.category] },
            5,
            0
          ]
        },

        titleScore: {
          $cond: [
            {
              $regexMatch: {
                input: "$name",
                regex: currentProduct.name.split(" ")[0],
                options: "i"
              }
            },
            3,
            0
          ]
        },

        browsingScore: {
          $cond: [
            { $in: ["$_id", viewedIds] },
            3,
            0
          ]
        },

        wishlistScore: {
          $size: {
            $setIntersection: [
              "$wishlistUsers.userId",
              similarUserIds
            ]
          }
        }

      }
    },

    {
      $addFields: {
        score: {
          $add: [
            "$categoryScore",
            "$titleScore",
            "$browsingScore",
            "$wishlistScore",
            { $divide: ["$popularityScore", 100] }
          ]
        }
      }
    },

    { $sort: { score: -1 } },
    { $limit: 10 },

    {
      $project: {
        wishlistUsers: 0
      }
    }

  ])

  // Cold Start Fallback
  if (recommendations.length === 0) {
    return await Product
      .find({ isActive: true })
      .sort({ popularityScore: -1 })
      .limit(10)
  }

  return recommendations
}