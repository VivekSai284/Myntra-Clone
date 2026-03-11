const DeviceToken = require("../models/deviceToken");

exports.registerToken = async (req, res) => {
  try {
    console.log("🔥 Register token API hit");
    console.log("BODY:", req.body);

    const { userId, token, platform } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ message: "Missing userId or token" });
    }

    await DeviceToken.findOneAndUpdate(
      { token },
      {
        user: userId,   // ⚠ must match schema field name
        token,
        platform,
        lastUsed: new Date(),
      },
      { upsert: true }
    );

    res.json({ message: "Token registered successfully" });

  } catch (error) {
    console.error("❌ ERROR IN REGISTER TOKEN:", error);
    res.status(500).json({ message: error.message });
  }
};