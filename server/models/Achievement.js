const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rank: { type: String, required: true },
  event: { type: String, required: true },
  organization: { type: String, default: '' },
  year: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  certificate: { type: String, default: '' },
  link: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
