const { pool } = require("../config/db");
const { generateKeywords } = require("../utils/keywords");

async function backfillKeywords() {
  console.log("🔄 Starting keywords backfill...");
  try {
    const { rows } = await pool.query(
      "SELECT id, title, description, category, subcategory, artisan_name FROM products"
    );
    console.log(`Found ${rows.length} products to process.`);

    let updatedCount = 0;
    for (const product of rows) {
      const keywords = generateKeywords({
        title: product.title,
        description: product.description,
        category: product.category,
        subcategory: product.subcategory,
        artisanName: product.artisan_name,
      });

      await pool.query(
        "UPDATE products SET keywords = $1 WHERE id = $2",
        [keywords, product.id]
      );
      updatedCount++;
    }

    console.log(`✅ Backfilled keywords for ${updatedCount} products.`);
  } catch (err) {
    console.error("❌ Error backfilling keywords:", err.message);
  } finally {
    await pool.end();
  }
}

backfillKeywords();
