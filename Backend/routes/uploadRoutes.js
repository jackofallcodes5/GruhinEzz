const express = require("express");
const path = require("path");
const fs = require("fs");
const {
  upload,
  uploadDir,
  uploadProductImage,
  productImageDir,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

// Helper to handle product image upload
function handleProductImageUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const fileName = req.file.filename;
    const protocol = req.protocol || "http";
    const host = req.get("host") || "localhost:5000";
    const fullUrl = `${protocol}://${host}/uploads/products/${fileName}`;
    const relativeUrl = `/uploads/products/${fileName}`;

    return res.status(200).json({
      message: "Product image uploaded successfully via Multer.",
      filename: fileName,
      imageUrl: fullUrl,
      relativeUrl: relativeUrl,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (err) {
    console.error("Upload product image error:", err);
    return res.status(500).json({ message: "Product image upload failed." });
  }
}

// POST /api/upload/product-image (field: 'image' or 'file')
router.post(
  "/product-image",
  (req, res, next) => {
    // Support either field name "image" or "file"
    const uploadSingle = uploadProductImage.single("image");
    uploadSingle(req, res, (err) => {
      if (err) {
        // Fallback to "file" field name
        const fallback = uploadProductImage.single("file");
        return fallback(req, res, (err2) => {
          if (err2) return res.status(400).json({ message: err2.message || "File upload error" });
          next();
        });
      }
      next();
    });
  },
  handleProductImageUpload
);

// POST /api/upload/image (alias)
router.post(
  "/image",
  (req, res, next) => {
    const uploadSingle = uploadProductImage.single("image");
    uploadSingle(req, res, (err) => {
      if (err) {
        const fallback = uploadProductImage.single("file");
        return fallback(req, res, (err2) => {
          if (err2) return res.status(400).json({ message: err2.message || "File upload error" });
          next();
        });
      }
      next();
    });
  },
  handleProductImageUpload
);

// GET /api/upload/products/:filename (view product image)
router.get("/products/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(productImageDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Product image not found." });
  }

  return res.sendFile(filePath);
});

// POST /api/upload/document
// Uploads a single document file, auto-renames according to role (S-DocType-userId / N-DocType-userId)
router.post("/document", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const fileName = req.file.filename;
    const fileUrl = `/api/documents/view/${fileName}`;
    const downloadUrl = `/api/documents/download/${fileName}`;

    return res.status(200).json({
      message: "Document uploaded successfully.",
      filename: fileName,
      fileUrl,
      downloadUrl,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (err) {
    console.error("Upload document error:", err);
    return res.status(500).json({ message: "File upload failed." });
  }
});

// GET /api/documents/view/:filename
// View document inline (PDF / Image)
router.get("/view/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Document not found." });
  }

  return res.sendFile(filePath);
});

// GET /api/documents/download/:filename
// Download individual document attachment
router.get("/download/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Document not found." });
  }

  return res.download(filePath, filename, (err) => {
    if (err && !res.headersSent) {
      return res.status(500).json({ message: "Error downloading document." });
    }
  });
});

module.exports = router;
