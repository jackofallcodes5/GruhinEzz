require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); // Fix ENOTFOUND for Supabase pooler
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { testConnection } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const sellerSetupRoutes = require("./routes/sellerSetupRoutes");
const sellerDashboardRoutes = require("./routes/sellerDashboardRoutes");
const ngoSetupRoutes = require("./routes/ngoSetupRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const empowermentProgramRoutes = require("./routes/empowermentProgramRoutes");

const app = express();
const path = require("path");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return callback(null, true);
      }
      const allowedOrigins = (process.env.CLIENT_ORIGINS || "").split(",").map(o => o.trim());
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve static uploaded images and files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "GruhinEzz E-Commerce Backend" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/seller-setup", sellerSetupRoutes);
app.use("/api/seller", sellerDashboardRoutes);
app.use("/api/ngo-setup", ngoSetupRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/documents", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/empowerment", empowermentProgramRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 5000;

testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 GruhinEzz backend running on http://localhost:${PORT}`);
  });
});

