const mongoose = require('mongoose');

const analyticsSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  visitorId: {
    type: String,
    required: true,
    index: true
  },
  isReturningVisitor: {
    type: Boolean,
    default: false
  },
  startedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastActivityAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  endedAt: {
    type: Date,
    default: null
  },
  durationSeconds: {
    type: Number,
    default: 0
  },
  activeTimeSeconds: {
    type: Number,
    default: 0
  },
  isLive: {
    type: Boolean,
    default: true
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'unknown'],
    default: 'unknown'
  },
  browser: {
    type: String,
    default: 'Unknown'
  },
  operatingSystem: {
    type: String,
    default: 'Unknown'
  },
  screenSize: {
    type: String,
    default: 'Unknown'
  },
  country: {
    type: String,
    default: 'Direct / Unknown'
  },
  region: {
    type: String,
    default: ''
  },
  referrer: {
    type: String,
    default: 'Direct'
  },
  referrerSource: {
    type: String,
    enum: ['Direct', 'Google/Search', 'LinkedIn', 'GitHub', 'Other'],
    default: 'Direct'
  },
  landingPage: {
    type: String,
    default: '/'
  },
  exitPage: {
    type: String,
    default: '/'
  },
  sectionsViewed: [{
    type: String
  }],
  actionsPerformed: [{
    type: String
  }],
  potentialRecruiterScore: {
    type: Number,
    default: 0
  },
  isPotentialRecruiter: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AnalyticsSession', analyticsSessionSchema);
