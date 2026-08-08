const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  title: { type: String, default: 'Venkata_Siva_Reddy_Resume.pdf' },
  filename: { type: String, required: true },
  url: { type: String, required: true },
  active: { type: Boolean, default: true },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
