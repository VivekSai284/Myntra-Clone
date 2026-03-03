const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // from JWT middleware

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(400).json({ message: "Product unavailable" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const item = await CartItem.findOneAndUpdate(
      { userId, productId },
      {
        quantity,
        priceAtAddition: product.price,
        status: "active",
      },
      { upsert: true, new: true }
    );

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity, version } = req.body;

    const item = await CartItem.findOneAndUpdate(
      { _id: cartItemId, version },  // 🔥 Optimistic locking here
      {
        $set: { quantity },
        $inc: { version: 1 },
      },
      { new: true }
    );

    if (!item) {
      return res.status(409).json({
        message: "Cart updated from another device. Refresh.",
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveForLater = async (req, res) => {
  try {
    const { cartItemId } = req.body;
    const userId = req.user.id; // from auth middleware

    const item = await CartItem.findOneAndUpdate(
      { _id: cartItemId, userId, status: "active" },
      { status: "saved" },
      { new: true }
    );

    if (!item) {
      return res.status(400).json({ message: "Cart item not found or already saved" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.moveToCart = async (req, res) => {
  try {
    const { cartItemId } = req.body;

    const item = await CartItem.findByIdAndUpdate(
      cartItemId,
      { status: "active" },
      { new: true }
    );

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  const activeItems = await CartItem.find({
    userId,
    status: "active",
  }).populate("productId");

  const savedItems = await CartItem.find({
    userId,
    status: "saved",
  }).populate("productId");

  const total = activeItems.reduce(
    (sum, item) => sum + item.quantity * item.productId.price,
    0
  );

  res.json({ activeItems, savedItems, total });
};

exports.validateCheckout = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeItems = await CartItem.find({
      userId,
      status: "active",
    }).populate("productId");

    if (activeItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (let item of activeItems) {
      const product = item.productId;

      // ❌ Discontinued product
      if (!product.isActive) {
        return res.status(400).json({
          message: `${product.name} is discontinued`,
        });
      }

      // ❌ Stock changed
      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `${product.name} stock changed`,
        });
      }

      // ❌ Price changed
      if (product.price !== item.priceAtAddition) {
        return res.status(400).json({
          message: `${product.name} price changed`,
        });
      }
    }

    res.json({ message: "Checkout validation successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};