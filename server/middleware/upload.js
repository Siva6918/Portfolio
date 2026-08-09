const multer = require('multer');
const path = require('path');

// Memory storage keeps files in buffer for converting to permanent Base64 Data URIs in MongoDB Atlas
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume' || file.fieldname === 'file') {
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf');
    const allowedTypes = /jpeg|jpg|png|webp|svg\+xml|svg|pdf/;
    const mimeType = allowedTypes.test(file.mimetype) || isPdf;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType || extName) {
      return cb(null, true);
    }
  }

  const allowedTypes = /jpeg|jpg|png|webp|svg\+xml|svg|pdf/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType || extName) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPG, PNG, WEBP, SVG) or PDF documents are allowed!'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter
});

module.exports = upload;
