const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { requireAuth } = require("../middleware/authMiddleware");

// Public route to get reviews for a product
router.get("/product/:productId", reviewController.getProductReviews);

// Protected route to add a review
router.post("/", requireAuth, reviewController.addReview);

module.exports = router;
