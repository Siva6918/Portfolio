const mongoose = require('mongoose');

const careerNodeSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  status: { type: String, enum: ['completed', 'active', 'future'], default: 'future' },
  icon: { type: String, default: 'Target' },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CareerNode', careerNodeSchema);
