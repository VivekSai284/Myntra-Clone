const express = require("express");
const router = express.Router();
const RecentlyViewed = require("../models/RecentlyViewed");

const MAX_ITEMS = 20;

// ✅ Add or update
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    await RecentlyViewed.findOneAndUpdate(
      { userId, productId },
      { viewedAt: new Date() },
      { upsert: true }
    );

    // keep only latest 20
    const all = await RecentlyViewed.find({ userId })
      .sort({ viewedAt: -1 });

    if (all.length > MAX_ITEMS) {
      const removeIds = all.slice(MAX_ITEMS).map(i => i._id);
      await RecentlyViewed.deleteMany({ _id: { $in: removeIds } });
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get list
router.get("/:userId", async (req, res) => {
  try {
    const list = await RecentlyViewed.find({
      userId: req.params.userId,
    })
      .sort({ viewedAt: -1 })
      .limit(MAX_ITEMS);

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;