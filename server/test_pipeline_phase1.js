/**
 * Phase 1 Pipeline Verification Script
 * Validates:
 * 1. Event schema with eventId, period (YYYY-MM), sessionId, timestamps.
 * 2. Session tracking with country/city, duration, activeTime, period.
 * 3. Bot/crawler filtering.
 * 4. Deduplication logic.
 * 5. Full chain for all required event types.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AnalyticsSession = require('./models/AnalyticsSession');
const AnalyticsEvent = require('./models/AnalyticsEvent');
const analyticsController = require('./controllers/analyticsController');

const mockReq = (body = {}, headers = {}) => ({
  body,
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    ...headers
  },
  socket: { remoteAddress: '127.0.0.1' }
});

const mockRes = () => {
  const res = {};
  res.statusCode = 200;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.data = data;
    return res;
  };
  return res;
};

async function runTests() {
  console.log('--- Starting Phase 1 Event Pipeline Verification ---');
  
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in server/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB Atlas');

  const testSessionId = `s_test_phase1_${Date.now()}`;
  const testVisitorId = `v_test_${Date.now()}`;
  const expectedPeriod = `${new Date().getUTCFullYear()}-${String(new Date().getUTCMonth() + 1).padStart(2, '0')}`;

  console.log(`\n1. Testing Session Start (Expected Period: ${expectedPeriod})...`);
  const startReq = mockReq({
    sessionId: testSessionId,
    visitorId: testVisitorId,
    deviceType: 'desktop',
    browser: 'Chrome',
    operatingSystem: 'Windows',
    screenSize: '1920x1080',
    referrer: 'https://linkedin.com/in/test',
    landingPage: '/'
  });
  const startRes = mockRes();
  await analyticsController.startSession(startReq, startRes);

  if (startRes.statusCode !== 200 || !startRes.data.success) {
    throw new Error(`startSession failed: ${JSON.stringify(startRes.data)}`);
  }

  const sessionDoc = await AnalyticsSession.findOne({ sessionId: testSessionId });
  if (!sessionDoc) throw new Error('Session doc not found in MongoDB!');
  if (sessionDoc.period !== expectedPeriod) throw new Error(`Incorrect session period: ${sessionDoc.period} vs ${expectedPeriod}`);
  if (sessionDoc.isBot !== false) throw new Error('Human session falsely marked as bot');
  console.log(`✓ Session doc created in MongoDB with period: ${sessionDoc.period}, country: ${sessionDoc.country}, city: ${sessionDoc.city}`);

  console.log('\n2. Testing Heartbeat & Active Duration...');
  const hbReq = mockReq({
    sessionId: testSessionId,
    activeTimeSeconds: 45,
    exitPage: '/#projects'
  });
  const hbRes = mockRes();
  await analyticsController.pulseHeartbeat(hbReq, hbRes);
  
  const updatedHbDoc = await AnalyticsSession.findOne({ sessionId: testSessionId });
  if (updatedHbDoc.activeTimeSeconds !== 45) throw new Error(`Heartbeat active time mismatch: ${updatedHbDoc.activeTimeSeconds}`);
  console.log(`✓ Heartbeat pulse recorded active time: ${updatedHbDoc.activeTimeSeconds}s`);

  console.log('\n3. Testing All Interaction & Section Events Batch...');
  const testEvents = [
    { action: 'view_resume', targetName: 'Resume PDF', section: 'Hero', eventType: 'interaction' },
    { action: 'download_resume', targetName: 'Resume PDF', section: 'Hero', eventType: 'interaction' },
    { action: 'project_open', targetName: 'NutriCloud Monitor', section: 'Projects', eventType: 'interaction' },
    { action: 'project_github_click', targetName: 'NutriCloud Repo', section: 'Projects', eventType: 'interaction' },
    { action: 'live_demo_click', targetName: 'NutriCloud Live', section: 'Projects', eventType: 'interaction' },
    { action: 'github_click', targetName: 'Header GitHub', section: 'Navigation', eventType: 'interaction' },
    { action: 'linkedin_click', targetName: 'Contact LinkedIn', section: 'Contact', eventType: 'interaction' },
    { action: 'email_click', targetName: 'Direct Email', section: 'Contact', eventType: 'interaction' },
    { action: 'college_click', targetName: 'RGMCET', section: 'Digital Campus', eventType: 'interaction' },
    { action: 'coding_profile_click', targetName: 'LeetCode', section: 'Experience', eventType: 'interaction' },
    { action: 'certification_click', targetName: 'AWS CCP', section: 'Certifications', eventType: 'interaction' },
    { action: 'contact_form_submit', targetName: 'Job Inquiry', section: 'Contact', eventType: 'interaction' },
    { action: 'section_reached', section: 'Projects', eventType: 'section_view', timeSpentSeconds: 0 },
    { action: 'section_leave', section: 'Projects', eventType: 'section_view', timeSpentSeconds: 18 }
  ];

  const evReq = mockReq({
    sessionId: testSessionId,
    events: testEvents
  });
  const evRes = mockRes();
  await analyticsController.recordEvents(evReq, evRes);

  if (evRes.statusCode !== 200 || !evRes.data.success) {
    throw new Error(`recordEvents failed: ${JSON.stringify(evRes.data)}`);
  }
  console.log(`✓ Recorded ${evRes.data.recorded} events`);

  const eventDocs = await AnalyticsEvent.find({ sessionId: testSessionId });
  if (eventDocs.length !== testEvents.length) {
    throw new Error(`Expected ${testEvents.length} events in DB, found ${eventDocs.length}`);
  }

  for (const doc of eventDocs) {
    if (!doc.eventId || !doc.eventId.startsWith('evt_')) {
      throw new Error(`Missing or invalid eventId on event: ${JSON.stringify(doc)}`);
    }
    if (doc.period !== expectedPeriod) {
      throw new Error(`Incorrect period ${doc.period} on event ${doc.action}`);
    }
  }
  console.log(`✓ All ${eventDocs.length} event documents have valid eventId and period: ${expectedPeriod}`);

  const enrichedSession = await AnalyticsSession.findOne({ sessionId: testSessionId });
  console.log(`✓ Recruiter Score Calculated: ${enrichedSession.potentialRecruiterScore} (isPotentialRecruiter: ${enrichedSession.isPotentialRecruiter})`);
  if (!enrichedSession.isPotentialRecruiter) {
    throw new Error('Expected high recruiter score with resume view/download/linkedin');
  }

  console.log('\n4. Testing Bot / Crawler Filtering...');
  const botSessionId = `s_bot_test_${Date.now()}`;
  const botReq = mockReq(
    { sessionId: botSessionId, visitorId: 'v_bot_1' },
    { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' }
  );
  const botRes = mockRes();
  await analyticsController.startSession(botReq, botRes);

  const botDoc = await AnalyticsSession.findOne({ sessionId: botSessionId });
  if (!botDoc || botDoc.isBot !== true) {
    throw new Error(`Bot User-Agent was not tagged with isBot: true! (got: ${botDoc?.isBot})`);
  }
  console.log('✓ Googlebot crawler successfully tagged with isBot: true');

  console.log('\n5. Testing Deduplication...');
  const dupReq = mockReq({
    sessionId: testSessionId,
    events: [
      { action: 'github_click', targetName: 'Header GitHub', section: 'Navigation', eventType: 'interaction' },
      { action: 'github_click', targetName: 'Header GitHub', section: 'Navigation', eventType: 'interaction' } // duplicate in same batch
    ]
  });
  const dupRes = mockRes();
  await analyticsController.recordEvents(dupReq, dupRes);
  if (dupRes.data.recorded !== 1) {
    throw new Error(`Expected 1 recorded event after deduplication, got ${dupRes.data.recorded}`);
  }
  console.log('✓ Duplicate identical event in same timestamp window was deduplicated successfully');

  // Clean up test documents
  await AnalyticsSession.deleteMany({ sessionId: { $in: [testSessionId, botSessionId] } });
  await AnalyticsEvent.deleteMany({ sessionId: testSessionId });
  console.log('✓ Cleaned up test documents from database');

  await mongoose.disconnect();
  console.log('\n=== ALL PHASE 1 PIPELINE VERIFICATIONS PASSED SUCCESSFULLY ===');
}

runTests().catch((err) => {
  console.error('\n❌ Test Error:', err);
  process.exit(1);
});
