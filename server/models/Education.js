const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  branch: { type: String, default: '' },
  college: { type: String, required: true },
  university: { type: String, default: '' },
  startYear: { type: String, required: true },
  endYear: { type: String, required: true },
  expectedGraduation: { type: String, default: '' },
  cgpa: { type: String, default: '' },
  percentage: { type: String, default: '' },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  logo: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);
