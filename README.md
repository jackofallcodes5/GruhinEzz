# GruhinEzz 🛍️🌸

> **Empowering Household Women Entrepreneurs & NGOs through E-Commerce**

GruhinEzz is an end-to-end e-commerce platform designed to empower household women entrepreneurs and non-governmental organizations (NGOs). It provides a direct digital marketplace to showcase handcrafted products, streamline seller & NGO onboarding with legal/bank verification, manage product listings, and process secure payments.

---

## 🏗️ Tech Stack

### **Frontend** (`/Front-End`)
- **Core Library & Build Tool**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), Custom CSS, [Lucide React](https://lucide.react.dev/) (Icons)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Payment Integration**: [`@cashfreepayments/cashfree-js`](https://www.cashfree.com/)
- **Code Quality**: [Oxlint](https://oxc-project.github.io/)

### **Backend** (`/Backend`)
- **Runtime & Framework**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- **Database**: PostgreSQL / [Supabase](https://supabase.com/) (using `pg` with automated schema initialization) & MySQL support
- **Authentication & Security**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, `cors`
- **Payment Processing**: Cashfree Payment Gateway SDK (`cashfree-pg`)
- **File Uploads**: `multer` (ID proofs, store logos, legal certificates)
- **Notifications & Mailers**: `nodemailer`, `resend` (Email OTPs & alerts)

---

## 🔥 Key Functionalities & Features

### 1. 👥 Multi-Role User Authentication & Management
- **Role-Based Access**: Dedicated workflows and dashboards for **Buyers**, **Sellers (Women Entrepreneurs)**, **NGOs**, and **System Administrators**.
- **Secure Authentication**: JWT-based token authentication, cookie sessions, password hashing (`bcrypt`), and OTP email verifications.

### 2. 👩‍💼 Women Entrepreneur (Seller) Onboarding
- **Personal KYC & Verification**: Step-by-step identity capture, date of birth, contact details, and ID proof document uploads.
- **Store & Business Setup**: Business type, category selection, GST handling, store description, address, and logo uploads.
- **Bank Account Integration**: Account details setup with Cashfree vendor binding for seamless payouts.

### 3. 🏢 NGO Partner Onboarding & Compliance
- **Organization Identity**: Registration number, establishment year, and logo setup.
- **Official Contact Verification**: Operational and registered address mapping, official contact person credentials.
- **Legal Document Submission**: Upload & validation for Registration Certificates, PAN Cards, and 80G/12A tax exemption documents.

### 4. 📊 Role-Specific Dashboards
- **Buyer Dashboard**: Product catalog browsing, filtering by categories/artisans, cart management, and order placement.
- **Seller Dashboard**: Inventory management (add/edit products, stock control), sales stats, and verification status tracking.
- **NGO Dashboard**: Overview of associated women artisans, program impact metrics, legal document status, and store linkages.
- **Admin Dashboard**: Centralized management suite for approving/rejecting seller KYC & NGO legal documents, user oversight, and tracking platform transactions.

### 5. 💳 Cashfree E-Commerce Payments
- Integrated Cashfree Payment Gateway for checkout flows.
- Automated creation of order records, transaction tracking, and payment status updates.

---

## 📂 Project Structure

```
GruhinEzz/
├── Backend/                # Express.js REST API server
│   ├── config/             # DB configuration & schema initialization
│   ├── controllers/        # Request handlers (Auth, Seller, NGO, Admin, Payment)
│   ├── middleware/         # Auth verification & file upload handlers
│   ├── models/             # Data models & helpers
│   ├── routes/             # API Endpoint definitions
│   ├── services/           # Payment & Mailer services
│   ├── sql/                # MySQL & PostgreSQL schema definitions
│   └── server.js           # Express app entry point
│
├── Front-End/              # React + Vite Client Application
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── dashboard/      # Role-based dashboard views (Buyer, Seller, NGO)
│       ├── ngosetup/       # Multi-step NGO onboarding views
│       ├── pages/          # Auth, Admin, and public pages
│       ├── sellersetup/    # Multi-step Seller onboarding views
│       └── services/       # API call handlers & Cashfree payment helpers
│
└── README.md               # Main project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **PostgreSQL / Supabase** or **MySQL** instance

### 1. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in `/Backend` (refer to `.env.example`):
```env
PORT=5000
DATABASE_URL=your_postgresql_or_supabase_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGINS=http://localhost:5173
```

Run the backend server:
```bash
npm run dev
```
*Note: The backend will automatically bootstrap database tables on startup.*

### 2. Frontend Setup
```bash
cd Front-End
npm install
```

Create a `.env` file in `/Front-End`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the frontend development server:
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 📜 License
This project is developed for empowering women entrepreneurs and supporting community initiatives. All rights reserved.