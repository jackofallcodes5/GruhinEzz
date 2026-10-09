# GruhinEzz — Backend API & Services

This directory contains the Node.js / Express backend infrastructure for **GruhinEzz**. It serves as the secure, high-performance brain of the platform, bridging the PostgreSQL database, cloud storage, payment gateways, and the client applications.

## 🛠️ Backend Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js (Modular REST API routing)
* **Database:** PostgreSQL (hosted on Supabase) via standard `pg` connection pools.
* **Authentication:** JSON Web Tokens (JWT) distributed via secure, HTTP-only cookies (`cookie-parser`).
* **Media / File Uploads:** `multer` combined with `multer-storage-cloudinary` to aggressively stream files to Cloudinary buckets, bypassing local disk usage.
* **Payments:** Razorpay official Node SDK for order creation and SHA256 signature verification.
* **Email Services:** `nodemailer` for SMTP transaction emails (Welcome, Verification statuses).

## 🔒 Security Architecture
* **Role-Based Access Control (RBAC):** Custom `authorizeRoles()` middleware strictly prevents users from accessing cross-role endpoints (e.g., stopping a Seller from hitting Admin verification routes).
* **Strict File Constraints:** 
  * KYC / Legal Documents are capped at **75KB**.
  * Product / Store Images are capped at **2MB**.
  * Handled dynamically to prevent DDoS via bandwidth exhaustion.
* **CORS Restrictions:** Configured to dynamically accept whitelisted origins via the `.env` file.

## 📂 Core API Structure
* `/api/auth` - Register, Login, Session Check (`/me`), Logout.
* `/api/admin` - Verification queues for Sellers & NGOs, user management.
* `/api/upload` - Secure Cloudinary streaming endpoints for Products and Documents.
* `/api/products` & `/api/reviews` - Marketplace inventory and dynamic 1-5 star rating aggregation.
* `/api/payment` - Razorpay logic (Order generation, cryptographic verification, DB ledger updates).
* `/api/empowerment` - NGO event creation, fetching NGO stats, and Seller event registration workflows.

## 📂 Backend File Structure

```text
Backend/
├── config/                     # Database setup and connection pools (db.js)
├── controllers/                # Core logic for processing req/res payloads
├── middleware/                 # RBAC authorizeRoles, Multer Cloudinary storage
├── models/                     # Raw SQL abstraction models
├── routes/                     # Definition of all Express.js endpoints
├── sql/                        # Table definitions (Run in Supabase Editor)
├── .env                        # Master secrets and API keys
├── server.js                   # Application entry point
└── package.json                
```

## 🚀 Environment Setup

Create a `.env` file in the root of `/Backend` (this directory):
```env
PORT=5000
# Comma-separated list of allowed frontend origins (No trailing slashes!)
CLIENT_ORIGINS=http://localhost:5173

# PostgreSQL Supabase Connection
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# Security
JWT_SECRET=super_secret_jwt_key_here

# Nodemailer / SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Razorpay Keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (uses `nodemon` for auto-restarts):
   ```bash
   npm run dev
   ```
3. Ensure your `.env` variables are correctly set and the Supabase database is reachable.

## 🌐 Production Deployment (Render)

1. Create a Web Service on [Render](https://render.com/).
2. Set the **Root Directory** to `Backend`.
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. Map all the `.env` variables into Render's Environment Variables dashboard.
   - *Crucial:* Set `CLIENT_ORIGINS` exactly to your Netlify URL (e.g., `https://gruhinezz.netlify.app`).
   - The backend uses `{ ssl: { rejectUnauthorized: false } }` natively, so it connects securely to Supabase.
