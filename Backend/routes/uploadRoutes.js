const express = require("express");
const path = require("path");
const fs = require("fs");
const {
  upload,
  uploadProductImage,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

// Helper to handle product image upload
function handleProductImageUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    // Cloudinary stores the remote URL in req.file.path
    const fullUrl = req.file.path;
    const fileName = req.file.filename;

    return res.status(200).json({
      message: "Product image uploaded successfully to Cloudinary.",
      filename: fileName,
      imageUrl: fullUrl,
      relativeUrl: fullUrl, // Keep interface consistent, but it's now an absolute URL
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



// POST /api/upload/document
// Uploads a single document file to Cloudinary
router.post("/document", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const fullUrl = req.file.path;
    const fileName = req.file.filename;

    return res.status(200).json({
      message: "Document uploaded successfully to Cloudinary.",
      filename: fileName,
      fileUrl: fullUrl,
      downloadUrl: fullUrl, // Cloudinary URLs can be used for viewing and downloading
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (err) {
    console.error("Upload document error:", err);
    return res.status(500).json({ message: "File upload failed." });
  }
});

module.exports = router;
