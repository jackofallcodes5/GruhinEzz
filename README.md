<div align="center">
  <img src="./Front-End/src/assets/logo.png" alt="GruhinEzz Logo" width="200"/>
  <h1>GruhinEzz — Women Empowerment & Community Impact E-Commerce</h1>
  <p><em>Empowering household women entrepreneurs by bridging the gap between local commerce, community NGOs, and the global market.</em></p>
</div>

<hr />

## 📖 Table of Contents
1. [Project Overview & Problem Statement](#-project-overview--problem-statement)
2. [Comprehensive Feature Set (By Role)](#-comprehensive-feature-set-by-role)
3. [Deep-Dive: Empowerment & NGO Ecosystem](#-deep-dive-empowerment--ngo-ecosystem)
4. [System Architecture & Tech Stack](#-system-architecture--tech-stack)
5. [Database Schema & ERD](#-database-schema--erd)
6. [API Design & Endpoints](#-api-design--endpoints)
7. [Security & Media Handling](#-security--media-handling)
8. [Environment Variables (Secrets)](#-environment-variables-secrets)
9. [Local Development Setup](#-local-development-setup)
10. [Production Deployment Guide](#-production-deployment-guide)
11. [Future Roadmap](#-future-roadmap)

---

## 🌍 Project Overview & Problem Statement

**The Problem:** Millions of household women create high-quality, authentic products (spices, handicrafts, pickles, snacks) but lack the technical literacy, platform, and logistics to scale their businesses. Simultaneously, NGOs working on rural women empowerment lack unified digital platforms to seamlessly connect their beneficiaries to real economic marketplaces.

**The Solution:** GruhinEzz is a specialized, modern e-commerce marketplace deeply focused on women empowerment. It provides household women entrepreneurs a hyper-accessible platform to sell their goods. Uniquely, GruhinEzz integrates **NGO Portals** directly into the e-commerce ecosystem—allowing NGOs to host skill-development programs, manage rural beneficiaries, and generate real-time impact reports alongside live economic transactions.

---

## 🎯 Comprehensive Feature Set (By Role)

The platform employs a rigid Role-Based Access Control (RBAC) system splitting users into 4 distinct groups:

### 1. 🛍️ Buyers (Consumers)
* **Product Discovery:** Browse a massive catalog of authentic homemade products categorised by type (Food, Handicrafts, Clothing).
* **Persistent Cart:** Database-driven cart system. Items remain in the cart across different devices until checkout.
* **Seamless Checkout:** Fully integrated Razorpay checkout gateway securely creating orders and verifying cryptographic signatures.
* **Reviews & Ratings:** Authenticated buyers can leave 1-5 star ratings and written reviews, which dynamically recalculate the product's overall aggregate score.
* **Order History:** Track historical orders and fulfillment status.

### 2. 👩‍🌾 Sellers (Household Entrepreneurs)
* **Secure KYC Onboarding:** Sellers must submit their ID proofs and Store Logos during setup. The portal remains strictly "Locked" until an Admin verifies their documents.
* **Inventory Management:** Full CRUD operations for their digital storefront. Sellers can upload product images, set stock counts, categories, and dynamic pricing.
* **Real-time Sales Dashboard:** View Total Revenue, Active Orders, and Analytics.
* **Empowerment Event Registration:** Sellers can browse skill-development and business-training programs hosted by NGOs and register for them with a single click.

### 3. 🤝 NGOs (Community Partners)
* **Rigorous Verification:** NGOs upload heavy legal compliance documents (Registration Certificate, PAN Card, 80G/12A Tax Exemptions, Contact Person ID).
* **Event Management:** Create, publish, and manage "Empowerment Programs" (e.g., *Digital Literacy for Weavers*, *FSSAI Certification Drive*).
* **Dynamic Impact Dashboard:** Live metrics calculating "Events Hosted", "Total Beneficiaries Enrolled", and a dynamic "Impact Score" based on seller engagement.
* **(Upcoming) Partnerships & Beneficiary Network:** Link rural women directly to their NGO profile to track economic upliftment.

### 4. 👑 Admins (Platform Overseers)
* **Master Command Center:** A beautiful data-table UI to manage the entire platform.
* **Document Verification Engine:** Admins can view uploaded KYC documents inline via a custom modal overlay without downloading files.
* **Approval/Rejection Queues:** Admins toggle `is_verified` flags for Sellers and NGOs, instantly unlocking or locking their respective dashboards via WebSockets/State updates.

---

---

## 📂 Master Repository File Structure

```text
GruhinEzz/
├── Backend/                    # Node.js + Express backend
│   ├── config/                 # DB connections and pool settings (db.js)
│   ├── controllers/            # Core business logic (auth, admin, products)
│   ├── middleware/             # Cloudinary upload storage, Auth tokens, RBAC
│   ├── models/                 # Database queries and aggregations
│   ├── routes/                 # Express API routes
│   ├── sql/                    # Raw Supabase Postgres schema migrations
│   └── server.js               # Entry point
├── Front-End/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (Product Cards, Cart)
│   │   ├── dashboard/          # Multi-role portals (Admin, NGO, Seller, Buyer)
│   │   ├── layouts/            # Navbar, Footer, and Base Layouts
│   │   ├── pages/              # Static & Dynamic route pages
│   │   └── services/           # Axios interceptors (apiClient.js)
│   ├── .env                    # Vite Environment bindings
│   └── package.json            
└── README.md                   # Master Documentation
```

## 🏗️ System Architecture & Tech Stack

The platform is designed using a decoupled Client-Server architecture utilizing a modern stack:

* **Frontend:** React.js (Vite), Tailwind CSS (for highly responsive, utility-first styling), Lucide React (vector icons), React Router DOM (client-side routing).
* **Backend:** Node.js, Express.js (RESTful architecture).
* **Database:** PostgreSQL (hosted on Supabase) accessed via standard `pg` connection pools.
* **Media & BLOB Storage:** Cloudinary (handles product images and heavily restricted KYC/legal documents).
* **Payments Gateway:** Razorpay API (End-to-End order creation and SHA256 signature verification).
* **Email & Notifications:** Nodemailer via standard SMTP (Gmail) for sending Welcome and Verification-Success emails.

---

## 🗄️ Database Schema & ERD

The relational structure is highly optimized with foreign keys, constraints, and cascading deletes.

* **`users`**: Base table containing `user_id` (UUID), `email`, `password_hash`, `role` (buyer, seller, ngo, admin), and `is_verified` (boolean).
* **`sellers`**: `seller_id` (FK -> users), `store_name`, `id_type`, `id_proof_url`, `store_logo_url`.
* **`ngos`**: `ngo_id` (FK -> users), `ngo_name`, `registration_number`, `reg_cert_url`, `pan_card_url`, `cert_80g_12a_url`.
* **`products`**: `product_id`, `seller_id` (FK), `title`, `description`, `price`, `stock`, `image_url`, `avg_rating`.
* **`reviews`**: `review_id`, `product_id` (FK), `buyer_id` (FK), `rating` (CHECK 1-5), `comment`.
* **`cart` / `cart_items`**: User-persistent cart bridging products to buyers.
* **`orders` / `order_items`**: `order_id`, `buyer_id`, `razorpay_order_id`, `razorpay_payment_id`, `total_amount`, `status`.
* **`empowerment_programs`**: `program_id`, `ngo_id` (FK), `title`, `category`, `start_at`, `registration_deadline`.
* **`program_registrations`**: Many-to-Many join table linking `program_id` and `seller_id`.

---

## 🔒 Security & Media Handling

### Authentication
* **HTTP-Only Cookies:** JWT tokens are issued and stored in `httpOnly` secure cookies, aggressively mitigating XSS (Cross-Site Scripting) attacks.
* **RBAC Middleware:** `authorizeRoles('admin')` automatically rejects unauthorized requests before they hit the controller.

### Cloudinary Upload Engine
To prevent server memory bloating and bandwidth abuse, local file storage is completely disabled.
* **Multer Storage Engine:** Pipes multipart/form-data directly to Cloudinary buckets.
* **Extreme Size Constraints:** 
  * `gruhinezz_documents` (KYC/Legal): Hard-capped at **75KB**.
  * `gruhinezz_products` (Images): Hard-capped at **2MB**.
* **Auto-Naming:** Files are programmatically hashed with standard prefixes (`S-IDProof-<uuid>.pdf`).

---

## 🔌 API Design & Endpoints

A quick overview of the modular REST API design:

| Endpoint | Method | Role Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/register` | POST | Public | Hashes password, creates base user, sends Welcome Email. |
| `/api/auth/me` | GET | Authenticated | Decodes JWT cookie, returns user session & verification status. |
| `/api/admin/users/pending` | GET | Admin | Returns list of all sellers & NGOs awaiting KYC verification. |
| `/api/admin/verify` | POST | Admin | Flips `is_verified` boolean to true, sends approval email. |
| `/api/upload/document` | POST | Seller/NGO | Streams PDF/JPG to Cloudinary (Max 75KB). Returns `fileUrl`. |
| `/api/products/seller` | GET | Seller | Retrieves all active inventory for a specific seller. |
| `/api/payment/create-order` | POST | Buyer | Pings Razorpay servers to generate a unique `order_id`. |
| `/api/payment/verify` | POST | Buyer | Validates Razorpay `x-razorpay-signature` against local secret. |
| `/api/empowerment/programs` | POST | NGO | NGO creates a new community skill-development event. |
| `/api/empowerment/programs/discover` | GET | Seller | Sellers view a marketplace of available NGO events. |

---

## 🚀 Environment Variables (Secrets)

To run this project, duplicate the `.env.example` files and populate them:

### Backend (`/Backend/.env`)
```env
PORT=5000
# Important: Ensure NO trailing slashes on URLs
CLIENT_ORIGINS=http://localhost:5173,https://your-netlify-app.netlify.app

# PostgreSQL Supabase Connection
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# JWT Secret
JWT_SECRET=super_secret_jwt_key_here

# SMTP / Email NodeMailer Setup
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Razorpay Integration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`/Front-End/.env`)
```env
# Change this to your Render URL when hosting
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 💻 Local Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/GruhinEzz.git
   cd GruhinEzz
   ```
2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   npm run dev
   # Backend starts on http://localhost:5000
   ```
3. **Setup Frontend** (In a new terminal)
   ```bash
   cd Front-End
   npm install
   npm run dev
   # Frontend starts on http://localhost:5173
   ```
4. **Database Initialization**
   Run the SQL scripts located in `Backend/sql/` sequentially in your Supabase SQL Editor.

---

## 🌐 Production Deployment Guide

This project is perfectly optimized to be deployed on **Netlify (Frontend)** and **Render (Backend)**.

### 1. Backend (Render.com)
* Create a new **Web Service** on Render and connect your Git repo.
* Set the **Root Directory** to `Backend`.
* **Build Command**: `npm install`
* **Start Command**: `node server.js`
* **Environment Variables**: Add everything from your `Backend/.env`.
  * **CRITICAL:** Ensure `CLIENT_ORIGINS` points exactly to your future Netlify URL (e.g., `https://gruhinezz.netlify.app`). This prevents CORS rejection.
  * Ensure `DATABASE_URL` is set. The DB connection utilizes `ssl: { rejectUnauthorized: false }` natively so it connects securely to Supabase.

### 2. Frontend (Netlify.com)
* Go to Netlify -> **Import an existing project**.
* Set **Base Directory** to `Front-End`.
* **Build Command**: `npm run build`
* **Publish Directory**: `dist`
* **Environment Variables**: 
  * Add `VITE_API_BASE_URL` = `https://your-render-backend-url.onrender.com/api`
* Deploy!

---

## 🔮 Future Roadmap & Expansion
- **NGO Beneficiary Network:** Deep-linking NGOs directly to specific rural communities and profiling success stories.
- **Logistics Integration:** Automating shipping label generation using Shiprocket / Delhivery APIs.
- **Multilingual Support:** Localizing the platform in regional languages (Hindi, Marathi, Telugu) for maximum rural accessibility.
- **AI-Powered Product Descriptions:** Helping non-technical sellers write beautiful product descriptions by passing image uploads through an AI vision model.

---
<div align="center">
  <p><em>Built with ❤️ to bridge the gap between technology and local community empowerment.</em></p>
</div>