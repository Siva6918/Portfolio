/**
 * Phase 2 Verification Script — Monthly Period Logic & Dashboard Aggregation Endpoint
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AnalyticsSession = require('./models/AnalyticsSession');
const AnalyticsEvent = require('./models/AnalyticsEvent');
const AnalyticsMeta = require('./models/AnalyticsMeta');
const analyticsController = require('./controllers/analyticsController');
const { ensureActivePeriod, getCurrentPeriod } = require('./utils/periodManager');

const mockReq = (query = {}) => ({
  query,
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/127.0.0.0',
    'x-admin-password': process.env.ADMIN_PASSWORD || 'SivaReddyAdmin2027!'
  }
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
  console.log('--- Starting Phase 2 Dashboard Aggregation & Period Rollover Verification ---');

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in server/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB Atlas');

  const currentPeriod = getCurrentPeriod();
  const historicalPeriod = '2026-07';

  console.log(`\n1. Testing Active Period Initialization (Expected: ${currentPeriod})...`);
  const activePeriod = await ensureActivePeriod();
  if (activePeriod !== currentPeriod) {
    throw new Error(`Active period mismatch: ${activePeriod} vs ${currentPeriod}`);
  }
  const metaDoc = await AnalyticsMeta.findOne({ key: 'active_period' });
  if (!metaDoc || metaDoc.activePeriod !== currentPeriod) {
    throw new Error('AnalyticsMeta active_period record not found in MongoDB!');
  }
  console.log(`✓ Stored active period verified in AnalyticsMeta: ${metaDoc.activePeriod}`);

  console.log('\n2. Seeding Test Sessions & Events for Current & Historical Periods...');
  const sCurrent1 = `s_p2_curr_1_${Date.now()}`;
  const sCurrent2 = `s_p2_curr_2_${Date.now()}`;
  const sHist = `s_p2_hist_1_${Date.now()}`;

  await AnalyticsSession.create([
    {
      sessionId: sCurrent1,
      visitorId: 'v_p2_recruiter',
      period: currentPeriod,
      isReturningVisitor: false,
      isBot: false,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      durationSeconds: 150,
      activeTimeSeconds: 120,
      country: 'India',
      city: 'Hyderabad',
      referrerSource: 'LinkedIn',
      landingPage: '/',
      exitPage: '/#contact',
      sectionsViewed: ['Hero', 'Projects', 'Experience'],
      actionsPerformed: ['view_resume', 'download_resume', 'linkedin_click'],
      potentialRecruiterScore: 100,
      isPotentialRecruiter: true
    },
    {
      sessionId: sCurrent2,
      visitorId: 'v_p2_student',
      period: currentPeriod,
      isReturningVisitor: true,
      isBot: false,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      durationSeconds: 60,
      activeTimeSeconds: 45,
      country: 'India',
      city: 'Bangalore',
      referrerSource: 'GitHub',
      landingPage: '/#projects',
      exitPage: '/#projects',
      sectionsViewed: ['Projects', 'Skills'],
      actionsPerformed: ['project_open', 'github_click'],
      potentialRecruiterScore: 35,
      isPotentialRecruiter: false
    },
    {
      sessionId: sHist,
      visitorId: 'v_p2_historical',
      period: historicalPeriod,
      isReturningVisitor: false,
      isBot: false,
      startedAt: new Date('2026-07-15T10:00:00Z'),
      lastActivityAt: new Date('2026-07-15T10:05:00Z'),
      durationSeconds: 300,
      activeTimeSeconds: 200,
      country: 'United States',
      city: 'San Francisco',
      referrerSource: 'Direct',
      landingPage: '/',
      exitPage: '/',
      sectionsViewed: ['Hero'],
      actionsPerformed: ['view_resume'],
      potentialRecruiterScore: 35,
      isPotentialRecruiter: false
    }
  ]);

  await AnalyticsEvent.create([
    {
      eventId: `evt_test_1_${Date.now()}`,
      sessionId: sCurrent1,
      period: currentPeriod,
      eventType: 'interaction',
      action: 'view_resume',
      targetName: 'Resume PDF',
      section: 'Hero'
    },
    {
      eventId: `evt_test_2_${Date.now()}`,
      sessionId: sCurrent1,
      period: currentPeriod,
      eventType: 'interaction',
      action: 'download_resume',
      targetName: 'Resume PDF',
      section: 'Hero'
    },
    {
      eventId: `evt_test_3_${Date.now()}`,
      sessionId: sCurrent1,
      period: currentPeriod,
      eventType: 'section_view',
      action: 'section_leave',
      section: 'Projects',
      timeSpentSeconds: 45
    },
    {
      eventId: `evt_test_4_${Date.now()}`,
      sessionId: sHist,
      period: historicalPeriod,
      eventType: 'interaction',
      action: 'view_resume',
      targetName: 'Resume PDF',
      section: 'Hero'
    }
  ]);
  console.log('✓ Seeded current and historical test data');

  console.log('\n3. Testing GET /api/analytics/dashboard for Current Period (Single Request)...');
  const dashReq = mockReq();
  const dashRes = mockRes();
  await analyticsController.getDashboard(dashReq, dashRes);

  if (dashRes.statusCode !== 200 || !dashRes.data.success) {
    throw new Error(`getDashboard failed: ${JSON.stringify(dashRes.data)}`);
  }

  const { period, summary, engagement, sections, traffic, recruiterInterest, sessions } = dashRes.data;

  if (period !== currentPeriod) throw new Error(`Incorrect period in dashboard response: ${period}`);
  if (!summary || typeof summary.totalSessions !== 'number') throw new Error('Invalid summary structure');
  if (!engagement || !engagement.actions) throw new Error('Invalid engagement structure');
  if (!Array.isArray(sections)) throw new Error('Invalid sections structure');
  if (!Array.isArray(traffic)) throw new Error('Invalid traffic structure');
  if (!Array.isArray(recruiterInterest)) throw new Error('Invalid recruiterInterest structure');
  if (!Array.isArray(sessions)) throw new Error('Invalid sessions structure');

  console.log('✓ Single response payload structure validated:');
  console.log(`  - Period: ${period}`);
  console.log(`  - Total Sessions in Period: ${summary.totalSessions}`);
  console.log(`  - Unique Visitors: ${summary.uniqueVisitors}, Returning: ${summary.returningVisitors}`);
  console.log(`  - Avg Session Duration: ${summary.avgSessionDuration}s`);
  console.log(`  - Resume Views: ${engagement.actions.resumeViews}, Downloads: ${engagement.actions.resumeDownloads}`);
  console.log(`  - Recruiter Interest Signals Found: ${recruiterInterest.length}`);
  console.log(`  - Top Traffic Source: ${traffic[0]?.source || 'None'} (${traffic[0]?.count || 0})`);

  console.log('\n4. Testing Historical Period Isolation (?period=2026-07)...');
  const histReq = mockReq({ period: historicalPeriod });
  const histRes = mockRes();
  await analyticsController.getDashboard(histReq, histRes);

  if (histRes.data.period !== historicalPeriod) {
    throw new Error(`Historical period mismatch: ${histRes.data.period}`);
  }
  const histSessions = histRes.data.sessions.filter(s => s.sessionId === sHist);
  if (histSessions.length !== 1) {
    throw new Error('Historical session not properly isolated');
  }
  const currInHist = histRes.data.sessions.filter(s => s.sessionId === sCurrent1);
  if (currInHist.length !== 0) {
    throw new Error('Current period session leaked into historical query');
  }
  console.log('✓ Historical query correctly isolated to 2026-07 without data leak');

  // Clean up
  await AnalyticsSession.deleteMany({ sessionId: { $in: [sCurrent1, sCurrent2, sHist] } });
  await AnalyticsEvent.deleteMany({ sessionId: { $in: [sCurrent1, sCurrent2, sHist] } });
  console.log('✓ Cleaned up test data');

  await mongoose.disconnect();
  console.log('\n=== ALL PHASE 2 VERIFICATIONS PASSED SUCCESSFULLY ===');
}

runTests().catch((err) => {
  console.error('\n❌ Test Error:', err);
  process.exit(1);
});
