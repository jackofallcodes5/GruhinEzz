-- ──────────────────────────────────────────────────────────────────────────────
-- GruhinEzz Database Schema Updates & Migrations
-- File: Backend/sql/update_schema.sql
-- ──────────────────────────────────────────────────────────────────────────────

-- 1. Alter Existing Tables: Add missing columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS keywords TEXT;

-- 2. Create New Tables: Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating      INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Demo Data Insertion for Products assigned to Seller (user_id = 10)
-- Assumes user_id = 10 exists in users table (Sunita Sharma)

INSERT INTO products (
  seller_id,
  title,
  description,
  price,
  original_price,
  discount_pct,
  category,
  subcategory,
  image_url,
  stock,
  artisan_name,
  seller_name,
  seller_location,
  artisan_story,
  rating,
  review_count,
  is_active,
  keywords
) VALUES
(
  10,
  'Handcrafted Organic Mango Pickle (500g)',
  'Traditional sun-cured raw mango pickle prepared with mustard oil, fenugreek, and hand-ground spices following a 50-year-old family recipe.',
  249.00,
  299.00,
  17,
  'Homemade Foods',
  'Pickles & Preserves',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
  25,
  'Sunita Sharma',
  'Sunita Sharma',
  'Jaipur, Rajasthan',
  'Learned traditional spice blending from her grandmother. Runs a small home rasoi empowering her family.',
  4.9,
  128,
  TRUE,
  'handcrafted organic mango pickle 500g traditional sun cured raw prepared mustard oil fenugreek hand ground spices following 50 year old family recipe homemade foods preserves sunita sharma jaipur rajasthan'
),
(
  10,
  'Handloom Chanderi Pure Silk Dupatta',
  'Exquisite hand-woven Chanderi silk dupatta with gold zari motifs, crafted by rural women weavers in Malwa.',
  1250.00,
  1600.00,
  22,
  'Apparel & Textiles',
  'Dupattas & Scarves',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
  15,
  'Lakshmi Devi',
  'Sunita Sharma',
  'Indore, Madhya Pradesh',
  'A 4th-generation handloom weaver supporting a cooperative of 12 women artisans in rural Malwa.',
  4.8,
  86,
  TRUE,
  'handloom chanderi pure silk dupatta exquisite hand woven gold zari motifs crafted rural women weavers malwa apparel textiles dupattas scarves lakshmi devi sunita sharma indore madhya pradesh'
),
(
  10,
  'Handpainted Terracotta Clay Tea Set',
  'Eco-friendly riverbed clay tea set including 1 kettle and 4 kulhads, hand-painted with natural mineral pigments.',
  650.00,
  850.00,
  23,
  'Home Decor & Pottery',
  'Pottery & Cookware',
  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
  10,
  'Radha Ben',
  'Sunita Sharma',
  'Kutch, Gujarat',
  'Molds natural riverbed clay on manual wheels with vibrant mineral mud pigments.',
  5.0,
  42,
  TRUE,
  'handpainted terracotta clay tea set eco friendly riverbed including 1 kettle 4 kulhads hand painted natural mineral pigments home decor pottery cookware radha ben sunita sharma kutch gujarat'
),
(
  10,
  'Cold-Pressed Organic Rose Water Soap (Set of 3)',
  'Artisan herbal bath soaps made with pure coconut oil, wild rose hydrosol, and goat milk.',
  320.00,
  400.00,
  20,
  'Organic & Herbal Care',
  'Soaps & Bath',
  'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&auto=format&fit=crop&q=80',
  30,
  'Meera Bai',
  'Sunita Sharma',
  'Udaipur, Rajasthan',
  'Formulates organic skincare products using locally harvested botanical extracts.',
  4.7,
  64,
  TRUE,
  'cold pressed organic rose water soap set 3 artisan herbal bath soaps made pure coconut oil wild hydrosol goat milk care bath meera bai sunita sharma udaipur rajasthan'
),
(
  10,
  'Homemade Bilona Pure A2 Cow Ghee (1 Litre)',
  'Traditional curd-churned Bilona ghee made from free-grazing Gir cow milk in Mathura.',
  1150.00,
  1400.00,
  18,
  'Homemade Foods',
  'Dairy & Oils',
  'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=800&auto=format&fit=crop&q=80',
  20,
  'Kamla Bai',
  'Sunita Sharma',
  'Mathura, UP',
  'Maintains a small dairy unit producing authentic A2 ghee through age-old Ayurvedic processes.',
  4.9,
  210,
  TRUE,
  'homemade bilona pure a2 cow ghee 1 litre traditional curd churned made free grazing gir milk mathura foods dairy oils kamla bai sunita sharma up'
),
(
  10,
  'Eco-Friendly Biodegradable Golden Jute Tote Bag',
  'Sturdy, handcrafted jute tote bag with cotton handles and traditional Kantha embroidery.',
  450.00,
  550.00,
  18,
  'Handicrafts',
  'Bags & Accessories',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
  18,
  'Anita Devi',
  'Sunita Sharma',
  'Kolkata, West Bengal',
  'Leads a 25-woman self-help group in Nadia district converting jute into eco-friendly tote fashion.',
  4.7,
  53,
  TRUE,
  'eco friendly biodegradable golden jute tote bag sturdy handcrafted cotton handles traditional kantha embroidery handicrafts bags accessories anita devi sunita sharma kolkata west bengal'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Demo Data Insertion for Sample Reviews
-- Assumes target product IDs and buyer user IDs exist
INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
SELECT 
  p.id AS product_id,
  10 AS user_id,
  5 AS rating,
  'Authentic taste and fresh aroma! Reminds me of traditional home cooking.',
  NOW() - INTERVAL '2 days'
FROM products p
WHERE p.seller_id = 10 AND p.title LIKE '%Mango Pickle%'
LIMIT 1;

INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
SELECT 
  p.id AS product_id,
  10 AS user_id,
  5 AS rating,
  'Gorgeous silk texture and immaculate zari work. Very well packaged!',
  NOW() - INTERVAL '5 days'
FROM products p
WHERE p.seller_id = 10 AND p.title LIKE '%Chanderi%'
LIMIT 1;
