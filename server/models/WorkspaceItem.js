const mongoose = require('mongoose');

const workspaceItemSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['work', 'personal'], 
    required: true 
  },
  name: { type: String, required: true },
  slug: { type: String, trim: true, lowercase: true },
  description: { type: String, required: true },
  
  // Cover Image
  coverImage: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },

  // Resource File
  resource: {
    url: { type: String },
    public_id: { type: String }
  },
  
  // Derived metadata
  resourceType: { 
    type: String, 
    enum: ['video', 'pdf', 'document', 'excel', 'image', 'link', null],
    default: null
  },
  resourceMimeType: { type: String },
  resourceFormat: { type: String },

  // For Personal Space only
  externalUrl: { type: String },

  displayOrder: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('WorkspaceItem', workspaceItemSchema);
