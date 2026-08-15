const AnalyticsMeta = require('../models/AnalyticsMeta');

/**
 * Compute current UTC period formatted as YYYY-MM (e.g. 2026-08)
 */
const getCurrentPeriod = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Check and manage server-side monthly rollover
 * Compares current UTC period to stored activePeriod in AnalyticsMeta.
 * If changed, records rollover without modifying or deleting old data.
 * @returns {Promise<string>} Current active period string (e.g. "2026-08")
 */
const ensureActivePeriod = async () => {
  const currentPeriod = getCurrentPeriod();
  
  try {
    let meta = await AnalyticsMeta.findOne({ key: 'active_period' });

    if (!meta) {
      meta = new AnalyticsMeta({
        key: 'active_period',
        activePeriod: currentPeriod,
        lastRolloverAt: new Date(),
        periodHistory: [{
          period: currentPeriod,
          startedAt: new Date()
        }]
      });
      await meta.save();
      console.log(`[Analytics Period] Initialized active period: ${currentPeriod}`);
      return currentPeriod;
    }

    // Check if period rolled over (new month)
    if (meta.activePeriod !== currentPeriod) {
      const previousPeriod = meta.activePeriod;
      console.log(`[Analytics Rollover] Rolling over period from ${previousPeriod} to ${currentPeriod}...`);

      const now = new Date();
      
      // Update history entry for old period
      if (Array.isArray(meta.periodHistory)) {
        const lastEntry = meta.periodHistory[meta.periodHistory.length - 1];
        if (lastEntry && !lastEntry.endedAt) {
          lastEntry.endedAt = now;
        }
        meta.periodHistory.push({
          period: currentPeriod,
          startedAt: now
        });
      }

      meta.activePeriod = currentPeriod;
      meta.lastRolloverAt = now;
      await meta.save();

      console.log(`[Analytics Rollover] Successfully transitioned to active period: ${currentPeriod}. Historical data preserved.`);
    }

    return meta.activePeriod;
  } catch (error) {
    console.error('[Analytics Period Error] ensureActivePeriod:', error.message);
    return currentPeriod;
  }
};

module.exports = {
  getCurrentPeriod,
  ensureActivePeriod
};
