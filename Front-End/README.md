# GruhinEzz — Frontend Application

This directory contains the highly interactive, Role-Based React Frontend for the **GruhinEzz** platform. 

It acts as the visual face of our Women Empowerment & Community Impact E-Commerce platform, connecting Buyers, Sellers, NGOs, and Admins into one seamless, responsive web application.

## 🛠️ Tech Stack & Libraries
* **Framework:** React.js powered by Vite (for lightning-fast HMR and building).
* **Routing:** `react-router-dom` for secure, multi-role dashboard navigation.
* **Styling:** Tailwind CSS (utility-first, highly responsive) + custom CSS modules for complex Glassmorphism UI.
* **Icons:** `lucide-react` for clean, consistent, customizable SVG icons.
* **API Communication:** `axios` configured with interceptors to handle HTTP-Only JWT tokens and global error states.
* **Payments UI:** Razorpay Checkout JS SDK for seamless modal-based transaction flows.

## 🌟 Core Modules

### 1. Unified Authentication System
* Responsive Login & Registration screens.
* Role selection matrix (Buyer | Seller | NGO) seamlessly integrated into onboarding flows.

### 2. Multi-Role Dashboards
* **Buyer Dashboard:** Product discovery, persistent cart management, secure Razorpay checkout, and order history tracking.
* **Seller Dashboard:** Digital storefront management (Products CRUD), KYC document submission, and one-click registration to NGO Empowerment Programs.
* **NGO Dashboard:** Complex verification gatekeeping, creation/management of skill-development events, and dynamic impact statistical tracking.
* **Admin Dashboard:** Centralized command center to verify/reject user profiles, and an inline custom modal to preview Cloudinary KYC documents without leaving the app.

## 📂 Frontend File Structure

```text
Front-End/
├── src/
│   ├── assets/                 # Images, logos, SVGs
│   ├── components/             # Reusable React UI (Cards, Modals, Spinners)
│   ├── dashboard/              # 4 Distinct Portals (admin.jsx, buyer.jsx, ngo.jsx, seller.jsx)
│   ├── layouts/                # Shared layout templates (Navbar/Footer wrappers)
│   ├── pages/                  # Landing pages and standalone views
│   ├── services/               # Centralized API logic (apiClient.js)
│   ├── App.jsx                 # Global Router definitions
│   └── main.jsx                # React DOM Mount point
├── .env                        # Local Environment Vars
├── package.json                
└── vite.config.js              # Vite Builder Configurations
```

## 🚀 Environment Setup

Create a `.env` file in the root of `/Front-End` (this directory):
```env
# Point this to your backend server URL
VITE_API_BASE_URL=http://localhost:5000/api
```

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

## 🌐 Production Deployment (Netlify)

1. Connect your repository to Netlify.
2. Select the **Base Directory** as `Front-End`.
3. Set the **Build Command** to `npm run build`.
4. Set the **Publish Directory** to `dist`.
5. In Netlify's Environment Variables, set:
   `VITE_API_BASE_URL` = `https://<YOUR-RENDER-BACKEND-URL>.onrender.com/api`
6. Deploy!
