const { pool } = require("../config/db");

/**
 * Get all reviews for a product with user details
 */
async function getReviewsByProductId(productId) {
  const query = `
    SELECT 
      r.id,
      r.product_id,
      r.user_id,
      r.rating,
      r.comment,
      r.created_at,
      u.user_name AS user_name,
      u.email AS user_email
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC
  `;
  const { rows } = await pool.query(query, [productId]);
  return rows;
}

/**
 * Add a review for a product by an authenticated user
 */
async function createReview({ productId, userId, rating, comment }) {
  const query = `
    INSERT INTO reviews (product_id, user_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING id, product_id, user_id, rating, comment, created_at
  `;
  const { rows } = await pool.query(query, [productId, userId, rating, comment]);
  return rows[0];
}

/**
 * Get average rating and count for a product
 */
async function getProductRatingStats(productId) {
  const query = `
    SELECT 
      COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS avg_rating,
      COUNT(*)::integer AS review_count
    FROM reviews
    WHERE product_id = $1
  `;
  const { rows } = await pool.query(query, [productId]);
  return rows[0];
}

module.exports = {
  getReviewsByProductId,
  createReview,
  getProductRatingStats,
};
