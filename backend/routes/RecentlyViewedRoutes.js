const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const RecentlyViewed = require("../models/RecentlyViewed");

const MAX_ITEMS = 20;

/* ======================================================
   ✅ ADD SINGLE VIEW (called from product page)
====================================================== */
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    await RecentlyViewed.findOneAndUpdate(
      { userId: objectUserId, productId },
      { viewedAt: new Date() },
      { upsert: true }
    );

    // ✅ keep only latest 20
    const all = await RecentlyViewed.find({ userId: objectUserId })
      .sort({ viewedAt: -1 });

    if (all.length > MAX_ITEMS) {
      const removeIds = all.slice(MAX_ITEMS).map(i => i._id);
      await RecentlyViewed.deleteMany({ _id: { $in: removeIds } });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("RECENTLY VIEWED ADD ERROR:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

/* ======================================================
   ✅ GET USER RECENTS
====================================================== */
router.get("/:userId", async (req, res) => {
  try {
    const objectUserId = new mongoose.Types.ObjectId(req.params.userId);

    const list = await RecentlyViewed.find({
      userId: objectUserId,
    })
      .sort({ viewedAt: -1 })
      .limit(MAX_ITEMS);

    res.json(list);

  } catch (err) {
    console.error("RECENTLY VIEWED GET ERROR:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

/* ======================================================
   ✅ 🔥 SYNC + MERGE (VERY IMPORTANT)
   Used after login for cross-device consistency
====================================================== */
router.post("/sync", async (req, res) => {
  try {
    const { userId, localItems } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserId required" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // ✅ get server items
    const serverItems = await RecentlyViewed.find({
      userId: objectUserId,
    });

    // 🔥 merge local + server
    const merged = [
      ...(localItems || []),
      ...serverItems.map(i => ({
        _id: i.productId,
        viewedAt: new Date(i.viewedAt).getTime(),
      })),
    ];

    // ✅ remove duplicates (keep latest)
    const map = new Map();

    merged.forEach(item => {
      if (
        !map.has(item._id) ||
        map.get(item._id).viewedAt < item.viewedAt
      ) {
        map.set(item._id, item);
      }
    });

    const finalItems = Array.from(map.values())
      .sort((a, b) => b.viewedAt - a.viewedAt)
      .slice(0, MAX_ITEMS);

    // ✅ clear old
    await RecentlyViewed.deleteMany({ userId: objectUserId });

    // ✅ insert merged
    if (finalItems.length > 0) {
      await RecentlyViewed.insertMany(
        finalItems.map(item => ({
          userId: objectUserId,
          productId: item._id,
          viewedAt: new Date(item.viewedAt),
        }))
      );
    }

    res.json(finalItems);

  } catch (err) {
    console.error("RECENTLY VIEWED SYNC ERROR:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

module.exports = router;