/**
 * Bot and Crawler User-Agent Detection Utility
 * Detects search engines, social media preview bots, curl, and headless browsers.
 */

const BOT_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /yandexbot/i,
  /duckduckbot/i,
  /baiduspider/i,
  /slurp/i,
  /twitterbot/i,
  /facebookexternalhit/i,
  /linkedinbot/i,
  /slackbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /applebot/i,
  /pinterestbot/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /dotbot/i,
  /rogerbot/i,
  /mj12bot/i,
  /petalbot/i,
  /headlesschrome/i,
  /phantomjs/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /python-requests/i,
  /aiohttp/i,
  /scrapy/i,
  /curl\//i,
  /wget\//i,
  /postmanruntime/i,
  /go-http-client/i,
  /java\//i,
  /node-fetch/i,
  /axios\//i, // only when standalone script/bot
  /bot\b/i,
  /crawler\b/i,
  /spider\b/i
];

/**
 * Check if the given User-Agent string belongs to a bot/crawler
 * @param {string} userAgent 
 * @returns {boolean}
 */
const isBot = (userAgent = '') => {
  if (!userAgent || typeof userAgent !== 'string') return false;
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
};

module.exports = {
  isBot
};
