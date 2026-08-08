const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  problem: { type: String, default: '' },
  solution: { type: String, default: '' },
  features: [{ type: String }],
  technologies: [{ type: String }],
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  category: { type: String, default: 'Full Stack' },
  thumbnail: { type: String, default: '' },
  screenshots: [{ type: String }],
  repositoryUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  status: { type: String, default: 'Completed' },
  featured: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
