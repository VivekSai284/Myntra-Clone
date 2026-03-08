const BrowsingHistory = require("../models/BrowsingHistory");
const Product = require("../models/Product");

exports.saveView = async (userId, productId) => {
  await BrowsingHistory.updateOne(
    { userId, productId },
    { viewedAt: new Date() },
    { upsert: true },
  );

  const userViews = await BrowsingHistory.find({ userId }).sort({
    viewedAt: -1,
  });

  if (userViews.length > 50) {
    const removeIds = userViews.slice(50).map((v) => v._id);

    await BrowsingHistory.deleteMany({
      _id: { $in: removeIds },
    });
  }
};
