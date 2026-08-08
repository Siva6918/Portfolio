const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const verifyAdminPassword = async (providedPassword) => {
  if (!providedPassword) return false;
  
  // Check against ADMIN_PASSWORD_HASH first if present
  if (process.env.ADMIN_PASSWORD_HASH) {
    try {
      const match = await bcrypt.compare(providedPassword, process.env.ADMIN_PASSWORD_HASH);
      if (match) return true;
    } catch (err) {
      console.error('Bcrypt comparison error:', err);
    }
  }

  // Fallback to ADMIN_PASSWORD in process.env
  const adminPwd = process.env.ADMIN_PASSWORD || 'SivaReddyAdmin2027!';
  return providedPassword === adminPwd;
};

const requireAdminAuth = async (req, res, next) => {
  try {
    // 1. Check direct X-Admin-Password header
    const directPassword = req.headers['x-admin-password'];
    if (directPassword) {
      const isValid = await verifyAdminPassword(directPassword);
      if (isValid) {
        return next();
      } else {
        return res.status(401).json({ success: false, message: 'Invalid admin password provided.' });
      }
    }

    // 2. Check Authorization Header Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key');
        if (decoded && decoded.isAdmin) {
          return next();
        }
      } catch (err) {
        return res.status(401).json({ success: false, message: 'Session expired or invalid admin token.' });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Admin authorization required. Please provide a valid password or admin session.'
    });
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ success: false, message: 'Authentication internal server error.' });
  }
};

module.exports = { requireAdminAuth, verifyAdminPassword };
