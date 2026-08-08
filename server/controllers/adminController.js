const jwt = require('jsonwebtoken');
const { verifyAdminPassword } = require('../middleware/authMiddleware');

const verifyAdminPasswordHandler = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Incorrect admin password.' });
    }

    const token = jwt.sign(
      { isAdmin: true },
      process.env.JWT_SECRET || 'super_secret_jwt_key',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      token,
      message: 'Admin authorization granted.'
    });
  } catch (error) {
    console.error('Password verification error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during verification.' });
  }
};

module.exports = { verifyAdminPasswordHandler };
