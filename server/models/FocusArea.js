const mongoose = require('mongoose');

const focusAreaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'Cpu' },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('FocusArea', focusAreaSchema);
