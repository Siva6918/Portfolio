const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  eventType: {
    type: String,
    enum: ['section_view', 'interaction'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  section: {
    type: String,
    default: 'General'
  },
  action: {
    type: String,
    default: 'view'
  },
  targetName: {
    type: String,
    default: ''
  },
  timeSpentSeconds: {
    type: Number,
    default: 0
  },
  firstViewedAt: {
    type: Date,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
