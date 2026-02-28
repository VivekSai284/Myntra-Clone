const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const TransactionAudit = require("../models/TransactionAudit");

// ✅ Idempotent webhook
router.post("/webhook", async (req, res) => {
  try {
    const { paymentId, orderId, userId, amount, paymentMode, status } = req.body;

    // 🔥 Check duplicate using paymentId
    let txn = await Transaction.findOne({ paymentId });

    if (txn) {
      return res.json({ message: "Already processed" });
    }

    // create invoice id
    const invoiceId = "INV-" + Date.now();

    txn = await Transaction.create({
      paymentId,
      orderId,
      userId,
      amount,
      paymentMode,
      status,
      invoiceId,
      paidAt: new Date(),
    });

    // audit log
    await TransactionAudit.create({
      transactionId: txn._id,
      event: status === "SUCCESS" ? "SUCCESS" : "FAILED",
      metadata: req.body,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Webhook failed" });
  }
});

module.exports = router;