const DeviceToken = require("../models/deviceToken");

exports.registerToken = async (req, res) => {
  try {
    const { userId, token, platform } = req.body;

    const device = await DeviceToken.findOneAndUpdate(
      { token },
      {
        user: userId,
        token,
        platform,
        lastUsed: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Token saved", device });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving token" });
  }
};