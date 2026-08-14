const AnalyticsSession = require('../models/AnalyticsSession');
const AnalyticsEvent = require('../models/AnalyticsEvent');

/**
 * Categorize referrer string into a standardized traffic source
 */
const parseReferrerSource = (referrer) => {
  if (!referrer || referrer === 'Direct' || referrer === '') return 'Direct';
  const lower = referrer.toLowerCase();
  if (lower.includes('linkedin.com') || lower.includes('lnkd.in')) return 'LinkedIn';
  if (lower.includes('github.com')) return 'GitHub';
  if (lower.includes('google.') || lower.includes('bing.') || lower.includes('yahoo.') || lower.includes('duckduckgo.')) return 'Google/Search';
  return 'Other';
};

/**
 * Derive user agent details if not explicitly passed by client
 */
const parseUserAgent = (uaString = '') => {
  const ua = uaString.toLowerCase();
  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    deviceType = /ipad|tablet/i.test(ua) ? 'tablet' : 'mobile';
  }

  let browser = 'Unknown';
  if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';

  let operatingSystem = 'Unknown';
  if (ua.includes('win')) operatingSystem = 'Windows';
  else if (ua.includes('mac')) operatingSystem = 'macOS';
  else if (ua.includes('linux')) operatingSystem = 'Linux';
  else if (ua.includes('android')) operatingSystem = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) operatingSystem = 'iOS';

  return { deviceType, browser, operatingSystem };
};

/**
 * Coarse country identification from headers
 */
const getCoarseCountry = (req) => {
  const headerCountry = req.headers['cf-ipcountry'] || 
                        req.headers['x-vercel-ip-country'] || 
                        req.headers['x-appengine-country'] || 
                        req.headers['x-country'];

  if (headerCountry && headerCountry !== 'XX' && headerCountry !== 'T1') {
    return headerCountry;
  }
  return 'India'; // Default coarse region fallback for display consistency
};

/**
 * Calculate potential recruiter interest score based on observable interaction patterns
 */
const calculateRecruiterScore = (sectionsViewed = [], actionsPerformed = []) => {
  let score = 0;
  
  if (actionsPerformed.includes('view_resume')) score += 35;
  if (actionsPerformed.includes('download_resume')) score += 40;
  if (actionsPerformed.includes('linkedin_click')) score += 25;
  if (actionsPerformed.includes('github_click')) score += 20;
  if (actionsPerformed.includes('contact_click') || actionsPerformed.includes('email_click') || actionsPerformed.includes('contact_form_submit')) score += 25;
  
  if (sectionsViewed.includes('Projects')) score += 15;
  if (sectionsViewed.includes('Experience')) score += 15;
  if (sectionsViewed.includes('Skills')) score += 10;
  if (sectionsViewed.includes('Certifications')) score += 10;

  return score;
};

// ─── PUBLIC TRACKING ENDPOINTS ───────────────────────────────────────────────

/**
 * POST /api/analytics/session
 * Initialize or update visitor session
 */
exports.startSession = async (req, res) => {
  try {
    const {
      sessionId,
      visitorId,
      isReturningVisitor = false,
      deviceType,
      browser,
      operatingSystem,
      screenSize,
      referrer = 'Direct',
      landingPage = '/'
    } = req.body;

    if (!sessionId || !visitorId) {
      return res.status(400).json({ success: false, message: 'sessionId and visitorId are required.' });
    }

    const uaFallback = parseUserAgent(req.headers['user-agent']);
    const referrerSource = parseReferrerSource(referrer);
    const country = getCoarseCountry(req);

    const sessionData = {
      sessionId,
      visitorId,
      isReturningVisitor: Boolean(isReturningVisitor),
      startedAt: new Date(),
      lastActivityAt: new Date(),
      isLive: true,
      deviceType: deviceType || uaFallback.deviceType,
      browser: browser || uaFallback.browser,
      operatingSystem: operatingSystem || uaFallback.operatingSystem,
      screenSize: screenSize || 'Unknown',
      country,
      referrer,
      referrerSource,
      landingPage,
      exitPage: landingPage
    };

    const session = await AnalyticsSession.findOneAndUpdate(
      { sessionId },
      { $set: sessionData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, data: session });
  } catch (error) {
    console.error('[Analytics Error] startSession:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to record session start.' });
  }
};

/**
 * POST /api/analytics/heartbeat
 * Periodic pulse to keep session live and update active duration
 */
exports.pulseHeartbeat = async (req, res) => {
  try {
    const { sessionId, activeTimeSeconds = 0, exitPage } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId required' });
    }

    const session = await AnalyticsSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const now = new Date();
    const durationSeconds = Math.max(0, Math.floor((now.getTime() - new Date(session.startedAt).getTime()) / 1000));

    session.lastActivityAt = now;
    session.durationSeconds = durationSeconds;
    if (activeTimeSeconds > session.activeTimeSeconds) {
      session.activeTimeSeconds = activeTimeSeconds;
    }
    if (exitPage) {
      session.exitPage = exitPage;
    }
    session.isLive = true;

    await session.save();

    return res.status(200).json({ success: true, isLive: true });
  } catch (error) {
    console.error('[Analytics Error] pulseHeartbeat:', error.message);
    return res.status(500).json({ success: false, message: 'Heartbeat failed' });
  }
};

/**
 * POST /api/analytics/events
 * Batched event recording (section views and user interactions)
 */
exports.recordEvents = async (req, res) => {
  try {
    let payload = req.body;

    // Support beacon string payloads if content-type was text/plain
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        payload = {};
      }
    }

    const { sessionId, events = [] } = payload;

    if (!sessionId || !Array.isArray(events) || events.length === 0) {
      return res.status(200).json({ success: true, recorded: 0 });
    }

    const formattedEvents = events.map(evt => ({
      sessionId,
      eventType: evt.eventType || (evt.action ? 'interaction' : 'section_view'),
      timestamp: evt.timestamp ? new Date(evt.timestamp) : new Date(),
      section: evt.section || 'General',
      action: evt.action || 'view',
      targetName: evt.targetName || '',
      timeSpentSeconds: evt.timeSpentSeconds || 0,
      firstViewedAt: evt.firstViewedAt ? new Date(evt.firstViewedAt) : null,
      metadata: evt.metadata || {}
    }));

    await AnalyticsEvent.insertMany(formattedEvents);

    // Update aggregate lists on AnalyticsSession
    const session = await AnalyticsSession.findOne({ sessionId });
    if (session) {
      const newSections = formattedEvents
        .filter(e => e.eventType === 'section_view' && e.section)
        .map(e => e.section);
      
      const newActions = formattedEvents
        .filter(e => e.eventType === 'interaction' && e.action)
        .map(e => e.action);

      const updatedSections = Array.from(new Set([...(session.sectionsViewed || []), ...newSections]));
      const updatedActions = Array.from(new Set([...(session.actionsPerformed || []), ...newActions]));

      const score = calculateRecruiterScore(updatedSections, updatedActions);

      session.sectionsViewed = updatedSections;
      session.actionsPerformed = updatedActions;
      session.potentialRecruiterScore = score;
      session.isPotentialRecruiter = score >= 45;
      session.lastActivityAt = new Date();
      session.isLive = true;

      await session.save();
    }

    return res.status(200).json({ success: true, recorded: formattedEvents.length });
  } catch (error) {
    console.error('[Analytics Error] recordEvents:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to record events.' });
  }
};

// ─── ADMIN REPORTING ENDPOINTS (Protected by requireAdminAuth) ──────────────

/**
 * GET /api/analytics/overview
 */
exports.getOverview = async (req, res) => {
  try {
    const totalSessions = await AnalyticsSession.countDocuments();
    const uniqueVisitorsList = await AnalyticsSession.distinct('visitorId');
    const uniqueVisitors = uniqueVisitorsList.length;

    const returningVisitorsList = await AnalyticsSession.distinct('visitorId', { isReturningVisitor: true });
    const returningVisitors = returningVisitorsList.length;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayVisitors = await AnalyticsSession.countDocuments({ startedAt: { $gte: startOfToday } });
    const weekVisitors = await AnalyticsSession.countDocuments({ startedAt: { $gte: sevenDaysAgo } });
    const monthVisitors = await AnalyticsSession.countDocuments({ startedAt: { $gte: thirtyDaysAgo } });

    // Calculate Average Session Duration
    const avgResult = await AnalyticsSession.aggregate([
      { $group: { _id: null, avgDuration: { $avg: '$durationSeconds' } } }
    ]);
    const avgSessionDuration = avgResult[0] ? Math.round(avgResult[0].avgDuration) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalVisitors: uniqueVisitors,
        uniqueVisitors,
        returningVisitors,
        totalSessions,
        avgSessionDuration,
        todayVisitors,
        weekVisitors,
        monthVisitors
      }
    });
  } catch (error) {
    console.error('[Analytics Error] getOverview:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch overview metrics.' });
  }
};

/**
 * GET /api/analytics/engagement
 */
exports.getEngagement = async (req, res) => {
  try {
    // Section Engagement aggregation
    const sectionStats = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'section_view' } },
      {
        $group: {
          _id: '$section',
          viewsCount: { $sum: 1 },
          totalTimeSpent: { $sum: '$timeSpentSeconds' },
          avgTimeSpent: { $avg: '$timeSpentSeconds' }
        }
      },
      { $sort: { viewsCount: -1 } }
    ]);

    // Key Action Counts
    const actionCounts = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'interaction' } },
      { $group: { _id: '$action', count: { $sum: 1 } } }
    ]);

    const actionMap = {};
    actionCounts.forEach(a => {
      actionMap[a._id] = a.count;
    });

    return res.status(200).json({
      success: true,
      data: {
        sections: sectionStats.map(s => ({
          section: s._id,
          views: s.viewsCount,
          totalTimeSpentSeconds: Math.round(s.totalTimeSpent),
          avgTimeSpentSeconds: Math.round(s.avgTimeSpent || 0)
        })),
        actions: {
          resumeViews: actionMap['view_resume'] || 0,
          resumeDownloads: actionMap['download_resume'] || 0,
          projectViews: actionMap['project_open'] || 0,
          githubClicks: actionMap['github_click'] || (actionMap['project_github_click'] || 0),
          linkedinClicks: actionMap['linkedin_click'] || 0,
          emailClicks: actionMap['email_click'] || (actionMap['contact_click'] || 0),
          contactSubmits: actionMap['contact_form_submit'] || 0
        }
      }
    });
  } catch (error) {
    console.error('[Analytics Error] getEngagement:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch engagement data.' });
  }
};

/**
 * GET /api/analytics/traffic-sources
 */
exports.getTrafficSources = async (req, res) => {
  try {
    const sources = await AnalyticsSession.aggregate([
      { $group: { _id: '$referrerSource', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: sources.map(s => ({
        source: s._id || 'Direct',
        count: s.count
      }))
    });
  } catch (error) {
    console.error('[Analytics Error] getTrafficSources:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch traffic sources.' });
  }
};

/**
 * GET /api/analytics/recruiter-signals
 */
exports.getRecruiterSignals = async (req, res) => {
  try {
    const sessions = await AnalyticsSession.find({
      $or: [
        { isPotentialRecruiter: true },
        { potentialRecruiterScore: { $gte: 30 } }
      ]
    }).sort({ startedAt: -1 }).limit(20);

    return res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('[Analytics Error] getRecruiterSignals:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch recruiter signals.' });
  }
};

/**
 * GET /api/analytics/sessions
 */
exports.getSessions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const total = await AnalyticsSession.countDocuments();
    const sessions = await AnalyticsSession.find()
      .sort({ startedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Attach event timeline to each session
    const sessionIds = sessions.map(s => s.sessionId);
    const events = await AnalyticsEvent.find({ sessionId: { $in: sessionIds } })
      .sort({ timestamp: 1 })
      .lean();

    const eventsBySession = {};
    events.forEach(evt => {
      if (!eventsBySession[evt.sessionId]) eventsBySession[evt.sessionId] = [];
      eventsBySession[evt.sessionId].push(evt);
    });

    const enrichedSessions = sessions.map(s => ({
      ...s,
      events: eventsBySession[s.sessionId] || []
    }));

    return res.status(200).json({
      success: true,
      data: enrichedSessions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('[Analytics Error] getSessions:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch visitor sessions.' });
  }
};

/**
 * GET /api/analytics/realtime
 */
exports.getRealtimeStatus = async (req, res) => {
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const activeCount = await AnalyticsSession.countDocuments({
      lastActivityAt: { $gte: twoMinutesAgo }
    });

    return res.status(200).json({
      success: true,
      activeVisitors: activeCount
    });
  } catch (error) {
    console.error('[Analytics Error] getRealtimeStatus:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch realtime status.' });
  }
};

/**
 * GET /api/analytics/export
 * Download CSV of visitor sessions
 */
exports.exportCsv = async (req, res) => {
  try {
    const sessions = await AnalyticsSession.find().sort({ startedAt: -1 }).lean();

    const headers = [
      'Session ID',
      'Started At',
      'Last Activity',
      'Duration (s)',
      'Active Time (s)',
      'Visitor Type',
      'Device',
      'Browser',
      'OS',
      'Screen Size',
      'Country',
      'Referrer',
      'Source',
      'Landing Page',
      'Exit Page',
      'Sections Viewed',
      'Actions Performed',
      'Recruiter Score',
      'Potential Recruiter'
    ];

    const rows = sessions.map(s => [
      `"${s.sessionId || ''}"`,
      `"${s.startedAt ? new Date(s.startedAt).toISOString() : ''}"`,
      `"${s.lastActivityAt ? new Date(s.lastActivityAt).toISOString() : ''}"`,
      s.durationSeconds || 0,
      s.activeTimeSeconds || 0,
      s.isReturningVisitor ? 'Returning' : 'New',
      `"${s.deviceType || 'unknown'}"`,
      `"${s.browser || 'Unknown'}"`,
      `"${s.operatingSystem || 'Unknown'}"`,
      `"${s.screenSize || 'Unknown'}"`,
      `"${s.country || 'Direct / Unknown'}"`,
      `"${(s.referrer || '').replace(/"/g, '""')}"`,
      `"${s.referrerSource || 'Direct'}"`,
      `"${s.landingPage || '/'}"`,
      `"${s.exitPage || '/'}"`,
      `"${(s.sectionsViewed || []).join(' > ')}"`,
      `"${(s.actionsPerformed || []).join(', ')}"`,
      s.potentialRecruiterScore || 0,
      s.isPotentialRecruiter ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=portfolio_analytics_export.csv');
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('[Analytics Error] exportCsv:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to export analytics CSV.' });
  }
};
