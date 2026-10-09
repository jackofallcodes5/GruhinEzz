const reviewModel = require("../models/reviewModel");

/**
 * GET /api/reviews/product/:productId
 */
async function getProductReviews(req, res) {
  try {
    const { productId } = req.params;
    const reviews = await reviewModel.getReviewsByProductId(productId);
    const stats = await reviewModel.getProductRatingStats(productId);
    return res.status(200).json({ success: true, reviews, stats });
  } catch (err) {
    console.error("❌ Error in getProductReviews:", err);
    return res.status(500).json({ success: false, message: "Server error fetching reviews" });
  }
}

/**
 * POST /api/reviews
 * Body: { productId, rating, comment }
 * Requires req.user from authMiddleware
 */
async function addReview(req, res) {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (!productId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Product ID and a valid rating (1-5) are required" });
    }

    const review = await reviewModel.createReview({
      productId,
      userId,
      rating: parseInt(rating, 10),
      comment: comment || "",
    });

    const stats = await reviewModel.getProductRatingStats(productId);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
      stats,
    });
  } catch (err) {
    console.error("❌ Error in addReview:", err);
    return res.status(500).json({ success: false, message: "Server error submitting review" });
  }
}

module.exports = {
  getProductReviews,
  addReview,
};
