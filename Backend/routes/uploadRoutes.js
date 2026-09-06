const express = require("express");
const path = require("path");
const fs = require("fs");
const { upload, uploadDir } = require("../middleware/uploadMiddleware");

const router = express.Router();

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
