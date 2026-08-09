const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['technical', 'soft'], default: 'technical' },
  logo: { type: String, default: '' },
  proficiency: { type: String, default: 'Intermediate' },
  percent: { type: Number, default: 80, min: 0, max: 100 },
  yearsOfExperience: { type: String, default: '1+ years' },
  description: { type: String, default: '' },
  featured: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
