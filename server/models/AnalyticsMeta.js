const mongoose = require('mongoose');

const analyticsMetaSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  activePeriod: {
    type: String,
    required: true // e.g. "2026-08"
  },
  lastRolloverAt: {
    type: Date,
    default: Date.now
  },
  periodHistory: [{
    period: String,
    startedAt: Date,
    endedAt: Date,
    totalSessions: Number,
    totalEvents: Number
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AnalyticsMeta', analyticsMetaSchema);
