const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth"); // your JWT middleware

router.post("/add", auth, cartController.addToCart);
router.put("/update", auth, cartController.updateCartItem);
router.post("/save", auth, cartController.saveForLater);
router.post("/move", auth, cartController.moveToCart);
router.get("/", auth, cartController.getCart);
router.post("/checkout", auth, cartController.validateCheckout);

module.exports = router;