const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  issueDate: { type: String, default: '' },
  expiryDate: { type: String, default: 'No Expiration' },
  credentialId: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  image: { type: String, default: '' },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  description: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
