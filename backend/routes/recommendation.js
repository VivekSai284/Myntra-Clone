const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// GET recommendations
router.get("/:userId/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // get current product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // find similar products (same brand for now)
    const recommendations = await Product.find({
      brand: product.brand,
      _id: { $ne: productId },
      isActive: true,
    })
      .limit(10)
      .lean();

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;