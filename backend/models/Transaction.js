const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    orderId: { type: String, required: true },
    paymentId: { type: String, unique: true, sparse: true }, // idempotency key
    invoiceId: { type: String, unique: true },

    webhookEventId: {
      type: String,
      unique: true,
      sparse: true,
    },

    paymentMode: {
      type: String,
      enum: ["CARD", "UPI", "NETBANKING", "WALLET", "COD"],
      required: true,
    },

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    invoiceId: {
      type: String,
      unique: true,
      sparse: true,
    },

    paidAt: { type: Date },
    paymentId: {
      type: String,
      index: true,
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
