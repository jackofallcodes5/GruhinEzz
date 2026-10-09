const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for KYC & Legal Documents via Cloudinary
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gruhinezz_documents",
    resource_type: "auto", // supports pdf, docx, images
    public_id: (req, file) => {
      const role = (req.body.role || req.body.userRole || "seller").toLowerCase();
      const docType = (req.body.docType || "Doc").replace(/[^a-zA-Z0-9]/g, "");
      const userId = req.body.userId || req.userId || "00000";
      const prefix = role === "ngo" ? "N" : "S";
      return `${prefix}-${docType}-${userId}-${Date.now()}`;
    },
  },
});

const upload = multer({
  storage: documentStorage,
  limits: { fileSize: 75 * 1024 }, // Max ~75KB (supports the 50-70KB requirement)
});

// Storage for Homemade Product & Craft Images via Cloudinary
const productImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "gruhinezz_products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    public_id: (req, file) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      return `product-${uniqueSuffix}`;
    },
  },
});

const uploadProductImage = multer({
  storage: productImageStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPG, PNG, WEBP) are allowed!"), false);
    }
  },
});

module.exports = {
  upload,
  uploadProductImage,
};
