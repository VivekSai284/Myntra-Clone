const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const AuditLog = require("../models/AuditLog");

router.post("/payment", async (req, res) => {
  try {
    const event = req.body;

    console.log("📩 Webhook received:", event);

    const eventId = event.id;
    const paymentId = event.payment_id || event.paymentId;

    if (!eventId || !paymentId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🛑 IDEMPOTENCY CHECK
    const existing = await Transaction.findOne({
      webhookEventId: eventId,
    });

    if (existing) {
      return res.json({ message: "Already processed" });
    }

    // ✅ UPSERT TRANSACTION
    const tx = await Transaction.findOneAndUpdate(
      { paymentId },
      {
        userId: event.userId,
        orderId: event.orderId,
        paymentMode: event.paymentMode,
        amount: event.amount,
        status: event.status,
        webhookEventId: eventId,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // ✅ AUDIT LOG
    await AuditLog.create({
      userId: event.userId,
      transactionId: tx._id,
      action: event.status || "created",
      metadata: event,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;