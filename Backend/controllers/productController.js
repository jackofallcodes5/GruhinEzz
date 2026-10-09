const productModel = require("../models/productModel");

/**
 * GET /api/products
 * Query params:
 *   - category (string)
 *   - subcategory (string)
 *   - search (string)
 *   - sort ('price-low', 'price-high', 'newest', 'rating', default 'newest')
 *   - page (number, default 1)
 *   - limit (number, default 12)
 */
async function getProducts(req, res) {
  try {
    const { category, subcategory, search, sort, page, limit } = req.query;
    const result = await productModel.getProducts({
      category,
      subcategory,
      search,
      sort,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 12,
    });
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("❌ Error in getProducts:", err);
    return res.status(500).json({ success: false, message: "Server error fetching products" });
  }
}

/**
 * GET /api/products/categories
 */
async function getCategories(req, res) {
  try {
    const categories = await productModel.getCategoriesWithSubcategories();
    return res.status(200).json({ success: true, categories });
  } catch (err) {
    console.error("❌ Error in getCategories:", err);
    return res.status(500).json({ success: false, message: "Server error fetching categories" });
  }
}

/**
 * GET /api/products/:id
 */
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("❌ Error in getProductById:", err);
    return res.status(500).json({ success: false, message: "Server error fetching product" });
  }
}

module.exports = {
  getProducts,
  getCategories,
  getProductById,
};
