const { pool } = require("../config/db");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a parameterized multi-word ILIKE search expression.
 * Returns { clause, params } where clause is an SQL AND-chain,
 * and params is an array of query parameter values.
 * startIndex: the next $N index to use.
 */
function buildSearchClause(words, startIndex) {
  const conditions = [];
  const params = [];
  let idx = startIndex;
  for (const word of words) {
    const pattern = `%${word}%`;
    conditions.push(
      `(p.keywords ILIKE $${idx} OR p.title ILIKE $${idx + 1} OR p.description ILIKE $${idx + 2})`
    );
    params.push(pattern, pattern, pattern);
    idx += 3;
  }
  return { clause: conditions.join(" AND "), params };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

async function getAllProducts({ page = 1, limit = 20, category } = {}) {
  const offset = (page - 1) * limit;
  const params = [];
  let whereClause = "WHERE p.is_active = TRUE";
  if (category && category !== "All") {
    params.push(category);
    whereClause += ` AND p.category = $${params.length}`;
  }
  params.push(limit, offset);

  const { rows } = await pool.query(
    `SELECT
       p.id, p.title, p.description, p.price, p.original_price, p.discount_pct,
       p.category, p.image_url, p.images, p.stock, p.artisan_name,
       p.seller_name, p.seller_location, p.artisan_story, p.is_active,
       p.created_at,
       u.user_name AS seller_user_name, u.id AS seller_id,
       COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) AS avg_rating,
       COUNT(r.id)::INT AS review_count
     FROM products p
     JOIN users u ON u.id = p.seller_id
     LEFT JOIN reviews r ON r.product_id = p.id
     ${whereClause}
     GROUP BY p.id, u.id
     ORDER BY p.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  // Count
  const countParams = category && category !== "All" ? [category] : [];
  const countWhere = category && category !== "All"
    ? "WHERE is_active = TRUE AND category = $1"
    : "WHERE is_active = TRUE";
  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*) FROM products ${countWhere}`,
    countParams
  );

  return {
    products: rows,
    total: parseInt(countRows[0].count, 10),
    page,
    totalPages: Math.ceil(parseInt(countRows[0].count, 10) / limit),
  };
}

async function getProductById(id) {
  const { rows } = await pool.query(
    `SELECT
       p.id, p.seller_id, p.title, p.description, p.price, p.original_price,
       p.discount_pct, p.category, p.image_url, p.images, p.stock,
       p.artisan_name, p.seller_name, p.seller_location, p.artisan_story,
       p.is_active, p.created_at, p.updated_at,
       u.user_name AS seller_user_name, u.email AS seller_email,
       COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) AS avg_rating,
       COUNT(r.id)::INT AS review_count
     FROM products p
     JOIN users u ON u.id = p.seller_id
     LEFT JOIN reviews r ON r.product_id = p.id
     WHERE p.id = $1
     GROUP BY p.id, u.id`,
    [id]
  );
  return rows[0] || null;
}

async function searchProducts({ q = "", category, page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const words = q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const params = [];
  const conditions = ["p.is_active = TRUE"];

  if (category && category !== "All") {
    params.push(category);
    conditions.push(`p.category = $${params.length}`);
  }

  if (words.length > 0) {
    const { clause, params: searchParams } = buildSearchClause(words, params.length + 1);
    conditions.push(`(${clause})`);
    params.push(...searchParams);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  // Count query
  const { rows: countRows } = await pool.query(
    `SELECT COUNT(DISTINCT p.id) FROM products p ${whereClause}`,
    params
  );

  // Data query
  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT
       p.id, p.title, p.description, p.price, p.original_price, p.discount_pct,
       p.category, p.image_url, p.images, p.stock, p.artisan_name,
       p.seller_name, p.seller_location, p.is_active, p.created_at,
       u.user_name AS seller_user_name, u.id AS seller_id,
       COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) AS avg_rating,
       COUNT(r.id)::INT AS review_count
     FROM products p
     JOIN users u ON u.id = p.seller_id
     LEFT JOIN reviews r ON r.product_id = p.id
     ${whereClause}
     GROUP BY p.id, u.id
     ORDER BY p.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const total = parseInt(countRows[0].count, 10);
  return {
    products: rows,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    query: q,
  };
}

async function getCategoriesWithSubcategories() {
  const { rows } = await pool.query(
    `SELECT DISTINCT category FROM products WHERE is_active = TRUE AND category IS NOT NULL`
  );
  return rows.map(row => ({
    name: row.category,
    subcategories: [] // Stub for future subcategory support if needed
  }));
}

module.exports = { getAllProducts, getProductById, searchProducts, getCategoriesWithSubcategories };
