const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  period: {
    type: String,
    required: true,
    index: true // e.g. "2026-08"
  },
  eventType: {
    type: String,
    enum: ['section_view', 'interaction'],
    required: true,
    index: true
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

// Optimized Compound Indexes for Fast Dashboard Aggregation & Queries
analyticsEventSchema.index({ period: 1, eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ period: 1, timestamp: -1 });
analyticsEventSchema.index({ sessionId: 1, timestamp: -1 });
analyticsEventSchema.index({ period: 1, action: 1 });
analyticsEventSchema.index({ period: 1, section: 1 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
