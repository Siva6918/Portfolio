const mongoose = require('mongoose');

const codingProfileSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  username: { type: String, default: '' },
  profileUrl: { type: String, required: true },
  logo: { type: String, default: '' },
  problemsSolved: { type: String, default: '150+' },
  rating: { type: String, default: '' },
  rank: { type: String, default: '' },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CodingProfile', codingProfileSchema);
