const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const { Parser } = require("json2csv");

// ✅ GET transactions with filtering + sorting + pagination
router.get("/", async (req, res) => {
  try {
    const {
      userId,
      page = 1,
      limit = 10,
      status,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = { userId };

    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      data: transactions,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.get("/export/csv", async (req, res) => {
  try {
    const { userId } = req.query;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.csv",
    );

    const cursor = Transaction.find({ userId }).cursor();

    res.write("Invoice,Amount,Status,PaymentMode,Date\n");

    for await (const doc of cursor) {
      const row = `${doc.invoiceId},${doc.amount},${doc.status},${doc.paymentMode},${doc.createdAt}\n`;
      res.write(row);
    }

    res.end();
  } catch (err) {
    res.status(500).json({ error: "CSV export failed" });
  }
});

const PDFDocument = require("pdfkit");

router.get("/receipt/:id", async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);

    if (!txn) return res.status(404).send("Not found");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${txn.invoiceId}.pdf`,
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text("Payment Receipt");
    doc.moveDown();

    doc.text(`Invoice: ${txn.invoiceId}`);
    doc.text(`Amount: ₹${txn.amount}`);
    doc.text(`Status: ${txn.status}`);
    doc.text(`Payment Mode: ${txn.paymentMode}`);
    doc.text(`Date: ${txn.createdAt}`);

    doc.end();
  } catch (err) {
    res.status(500).send("PDF failed");
  }
});

router.get("/export/csv/:userId", async (req, res) => {
  try {
    const { status } = req.query;

    const query = { userId: req.params.userId };
    if (status) query.status = status;

    const cursor = RecentlyViewed.find(query)
      .sort({ createdAt: -1 })
      .cursor();

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.csv"
    );
    res.setHeader("Content-Type", "text/csv");

    const fields = [
      "paymentMode",
      "amount",
      "status",
      "createdAt",
    ];

    const parser = new Parser({ fields });

    let isFirst = true;

    for await (const doc of cursor) {
      const csv =
        parser.parse([doc], { header: isFirst }) + "\n";
      res.write(csv);
      isFirst = false;
    }

    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Export failed" });
  }
});

module.exports = router;
