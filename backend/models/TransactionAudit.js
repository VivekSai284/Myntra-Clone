const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    event: {
      type: String,
      enum: ["CREATED", "SUCCESS", "FAILED", "REFUND"],
    },
    metadata: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransactionAudit", auditSchema);