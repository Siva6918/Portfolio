const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  username: { type: String, default: '' },
  url: { type: String, required: true },
  logo: { type: String, default: '' },
  active: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SocialLink', socialLinkSchema);
