const Product = require("../models/Product")
const BrowsingHistory = require("../models/BrowsingHistory")

exports.getRecommendations = async (userId, currentProductId) => {

  const currentProduct = await Product.findById(currentProductId)

  if (!currentProduct) return []

  const browsing = await BrowsingHistory
    .find({ userId })
    .sort({ viewedAt: -1 })
    .limit(10)

  const viewedIds = browsing.map(b => b.productId)

  const recommendations = await Product.aggregate([

    {
      $match: {
        _id: { $ne: currentProduct._id }
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

        browsingScore: {
          $cond: [
            { $in: ["$_id", viewedIds] },
            3,
            0
          ]
        }

      }
    },

    {
      $addFields: {
        score: {
          $add: [
            "$categoryScore",
            "$browsingScore",
            { $divide: ["$popularityScore", 100] }
          ]
        }
      }
    },

    {
      $sort: { score: -1 }
    },

    {
      $limit: 10
    }

  ])

  return recommendations

}