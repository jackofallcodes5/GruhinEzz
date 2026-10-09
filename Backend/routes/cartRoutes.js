const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { requireAuth } = require("../middleware/authMiddleware");

// All cart routes require a logged-in user (buyer)
router.use(requireAuth);

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.put("/:productId", cartController.updateCartItem);
router.delete("/:productId", cartController.removeFromCart);
router.delete("/", cartController.clearCart);

module.exports = router;
