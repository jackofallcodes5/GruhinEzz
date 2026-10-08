const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1. Documents Directory
const uploadDir = path.join(__dirname, "../uploads/documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Products / Crafts Images Directory
const productImageDir = path.join(__dirname, "../uploads/products");
if (!fs.existsSync(productImageDir)) {
  fs.mkdirSync(productImageDir, { recursive: true });
}

// Storage for KYC & Legal Documents
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Expected fields in body: role ('seller' | 'ngo'), docType ('PAN', 'GST', 'IDProof', etc.), userId
    const role = (req.body.role || req.body.userRole || "seller").toLowerCase();
    const docType = (req.body.docType || "Doc").replace(/[^a-zA-Z0-9]/g, "");
    const userId = req.body.userId || req.userId || "00000";

    const prefix = role === "ngo" ? "N" : "S";
    const ext = path.extname(file.originalname) || ".pdf";
    
    // Format: S-Type_of_Doc-user_id.ext or N-Type_of_Doc-user_id.ext
    const filename = `${prefix}-${docType}-${userId}${ext}`;

    // Overwrite existing file if re-uploaded by removing old file first
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.warn("Could not delete existing file before replacement:", e.message);
      }
    }

    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

// Storage for Homemade Product & Craft Images
const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productImageDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalExt = path.extname(file.originalname).toLowerCase() || ".jpg";
    const cleanExt = [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(originalExt)
      ? originalExt
      : ".jpg";
    cb(null, `product-${uniqueSuffix}${cleanExt}`);
  },
});

const uploadProductImage = multer({
  storage: productImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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
  uploadDir,
  uploadProductImage,
  productImageDir,
};
