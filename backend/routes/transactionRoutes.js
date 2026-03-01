const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const PDFDocument = require("pdfkit");

const MAX_LIMIT = 50;

/* =====================================================
   ✅ GET transactions (filter + sort + pagination)
===================================================== */
router.get("/", async (req, res) => {
  try {
    const {
      userId,
      page = 1,
      limit = 10,
      status,
      paymentMode,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), MAX_LIMIT);

    const query = { userId };

    if (status) query.status = status;
    if (paymentMode) query.paymentMode = paymentMode;

    const transactions = await Transaction.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Transaction.countDocuments(query);

    res.json({
      data: transactions,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

/* =====================================================
   ✅ STREAMING CSV EXPORT (MEMORY SAFE)
===================================================== */
router.get("/export/csv/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.csv"
    );

    // header row
    res.write("Invoice,Amount,Status,PaymentMode,Date\n");

    const cursor = Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .cursor();

    for await (const doc of cursor) {
      const row = `${doc.invoiceId || ""},${doc.amount},${doc.status},${doc.paymentMode},${doc.createdAt}\n`;
      res.write(row);
    }

    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "CSV export failed" });
  }
});

/* =====================================================
   ✅ PDF RECEIPT
===================================================== */
router.get("/receipt/:id", async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);

    if (!txn) {
      return res.status(404).send("Transaction not found");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${txn.invoiceId}.pdf`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text("Payment Receipt", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Invoice ID: ${txn.invoiceId}`);
    doc.text(`Payment ID: ${txn.paymentId}`);
    doc.text(`Amount: ₹${txn.amount}`);
    doc.text(`Status: ${txn.status}`);
    doc.text(`Payment Mode: ${txn.paymentMode}`);
    doc.text(`Date: ${txn.createdAt}`);

    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("PDF failed");
  }
});

module.exports = router;