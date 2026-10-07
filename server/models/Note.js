const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  readTime: { type: String, default: '5 min read' },
  content: { type: String, required: true }, // Markdown content
  excerpt: { type: String, required: true },
  coverImage: { type: String },
  isPublished: { type: Boolean, default: false },
  tags: [{ type: String }],
  relatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  relatedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
