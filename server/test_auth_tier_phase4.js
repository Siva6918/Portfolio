/**
 * Phase 4 Verification Script — Password-Protected Detail Tier & Public Summary Tier
 */

require('dotenv').config();
const mongoose = require('mongoose');
const analyticsController = require('./controllers/analyticsController');

const mockReq = (headers = {}, query = {}) => ({
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/127.0.0.0',
    ...headers
  },
  query
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

async function testAuthTier() {
  console.log('--- Starting Phase 4 Password-Protected Detail Tier Verification ---');

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in server/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB Atlas');

  const adminPassword = process.env.ADMIN_PASSWORD || 'SivaReddyAdmin2027!';

  console.log('\n1. Testing Unauthenticated Request (Public Summary Tier)...');
  const pubReq = mockReq();
  const pubRes = mockRes();
  await analyticsController.getDashboard(pubReq, pubRes);

  if (pubRes.statusCode !== 200 || !pubRes.data.success) {
    throw new Error(`Public tier request failed: ${JSON.stringify(pubRes.data)}`);
  }

  if (pubRes.data.isAuthorized !== false) {
    throw new Error(`Expected isAuthorized: false for public request, got: ${pubRes.data.isAuthorized}`);
  }

  if (!pubRes.data.summary || typeof pubRes.data.summary.totalSessions !== 'number') {
    throw new Error('Public summary stat numbers are missing');
  }

  if (pubRes.data.engagement !== null || pubRes.data.recruiterInterest !== null || pubRes.data.sessions !== null) {
    throw new Error('Security Breach: Detail telemetry leaked on unauthenticated request!');
  }

  console.log('✓ Public Tier verified:');
  console.log(`  - isAuthorized: false`);
  console.log(`  - Summary Total Sessions: ${pubRes.data.summary.totalSessions}`);
  console.log(`  - Engagement: ${pubRes.data.engagement} (Redacted)`);
  console.log(`  - Recruiter Signals: ${pubRes.data.recruiterInterest} (Redacted)`);
  console.log(`  - Sessions: ${pubRes.data.sessions} (Redacted)`);

  console.log('\n2. Testing Authenticated Request (Authorized Detail Tier)...');
  const authReq = mockReq({ 'x-admin-password': adminPassword });
  const authRes = mockRes();
  await analyticsController.getDashboard(authReq, authRes);

  if (authRes.statusCode !== 200 || !authRes.data.success) {
    throw new Error(`Authenticated request failed: ${JSON.stringify(authRes.data)}`);
  }

  if (authRes.data.isAuthorized !== true) {
    throw new Error(`Expected isAuthorized: true for authenticated request, got: ${authRes.data.isAuthorized}`);
  }

  if (!authRes.data.engagement || !authRes.data.engagement.actions) {
    throw new Error('Engagement metrics missing on authenticated request');
  }

  if (!Array.isArray(authRes.data.recruiterInterest) || !Array.isArray(authRes.data.sessions)) {
    throw new Error('Recruiter signals / Sessions arrays missing on authenticated request');
  }

  console.log('✓ Authenticated Detail Tier verified:');
  console.log(`  - isAuthorized: true`);
  console.log(`  - Actions Tracked: Total Interactions = ${authRes.data.engagement.actions.totalInteractions}`);
  console.log(`  - Section View Dwell Timings: ${authRes.data.sections.length} sections`);
  console.log(`  - Recruiter Interest Signals Array: ${authRes.data.recruiterInterest.length} entries`);
  console.log(`  - Sessions Telemetry Array: ${authRes.data.sessions.length} entries`);

  console.log('\n3. Testing Request with Invalid Password (Security Test)...');
  const badReq = mockReq({ 'x-admin-password': 'WrongPassword123!' });
  const badRes = mockRes();
  await analyticsController.getDashboard(badReq, badRes);

  if (badRes.data.isAuthorized !== false || badRes.data.engagement !== null) {
    throw new Error('Security Breach: Detail tier unlocked with invalid password!');
  }
  console.log('✓ Invalid password safely defaults to redacted public summary tier');

  await mongoose.disconnect();
  console.log('\n=== ALL PHASE 4 VERIFICATIONS PASSED SUCCESSFULLY ===');
}

testAuthTier().catch((err) => {
  console.error('\n❌ Phase 4 Test Error:', err);
  process.exit(1);
});
