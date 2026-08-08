const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  year: { type: String, required: true },
  location: { type: String, default: 'Remote / On-site' },
  mode: { type: String, default: 'Internship' },
  description: { type: String, default: '' },
  responsibilities: [{ type: String }],
  technologies: [{ type: String }],
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  certificate: { type: String, default: '' },
  certificateUrl: { type: String, default: '' },
  companyUrl: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
