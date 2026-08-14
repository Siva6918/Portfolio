const rateLimit = require('express-rate-limit');

const adminVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 verification requests per windowMs
  message: {
    success: false,
    message: 'Too many password verification attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  skip: (req) => req.path.includes('/analytics'),
  message: {
    success: false,
    message: 'Too many requests from this IP. Please wait a moment.'
  }
});

module.exports = { adminVerifyLimiter, apiLimiter };
