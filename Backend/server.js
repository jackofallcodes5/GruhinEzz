require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { testConnection } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const sellerSetupRoutes = require("./routes/sellerSetupRoutes");
const ngoSetupRoutes = require("./routes/ngoSetupRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "GruhinEzz E-Commerce Backend" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/seller-setup", sellerSetupRoutes);
app.use("/api/ngo-setup", ngoSetupRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

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
