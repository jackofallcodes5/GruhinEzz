const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

module.exports = { upload, uploadDir };
