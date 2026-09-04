const mongoose = require('mongoose');

const freelanceOpportunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  projectTitle: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: { type: String, required: true },
  expectedDuration: { type: String, required: true },
  budget: { type: String, required: true },
  currency: { type: String, required: true },
  startDate: { type: String, required: true },
  additionalRequirements: { type: String },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('FreelanceOpportunity', freelanceOpportunitySchema);
