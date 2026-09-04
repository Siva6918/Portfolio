const multer = require('multer');
const path = require('path');

// Memory storage keeps files in buffer for Cloudinary upload or Base64 Data URI storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf');
    const allowedTypes = /jpeg|jpg|png|webp|svg\+xml|svg|pdf/;
    const mimeType = allowedTypes.test(file.mimetype) || isPdf;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType || extName) return cb(null, true);
    return cb(new Error('Only PDF files are allowed for resume!'), false);
  }

  // Allow images, PDFs, video files, and office docs for media uploads
  const allowedMimeTypes = /jpeg|jpg|png|webp|svg\+xml|svg|pdf|mp4|webm|quicktime|ogg|x-msvideo|msword|officedocument|excel|spreadsheetml/;
  const allowedExtensions = /\.(jpe?g|png|webp|svg|pdf|mp4|webm|mov|ogg|avi|doc|docx|xls|xlsx)$/i;

  const mimeOk = allowedMimeTypes.test(file.mimetype);
  const extOk = allowedExtensions.test(path.extname(file.originalname));

  if (mimeOk || extOk) {
    return cb(null, true);
  }
  cb(new Error('Only image, PDF, video, doc, or excel files are allowed!'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for video files
  fileFilter
});

module.exports = upload;
