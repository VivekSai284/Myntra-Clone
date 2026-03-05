const express = require("express")
const router = express.Router()

const { getRecommendations } = require("../services/recommendationService")

router.get("/:productId", async (req, res) => {

  const userId = req.user.id
  const productId = req.params.productId

  const recs = await getRecommendations(userId, productId)

  res.json(recs)

})

module.exports = router