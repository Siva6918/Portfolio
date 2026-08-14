import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { buildApiUrl } from '../services/api';

const AnalyticsContext = createContext({
  sessionId: '',
  trackInteraction: () => {},
  registerSectionRef: () => {}
});

export const useAnalytics = () => useContext(AnalyticsContext);

// Utility to generate compact random ID (e.g. A8F3 or v_8f2a)
const generateId = (prefix = 's') => {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_${result}`;
};

// Parse coarse device & browser info
const detectDeviceInfo = () => {
  const ua = navigator.userAgent || '';
  const isMobile = /mobile|android|iphone|phone/i.test(ua);
  const isTablet = /ipad|tablet/i.test(ua);
  const deviceType = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');

  let browser = 'Unknown';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('OPR') || ua.includes('Opera')) browser = 'Opera';

  let operatingSystem = 'Unknown';
  if (ua.includes('Win')) operatingSystem = 'Windows';
  else if (ua.includes('Mac')) operatingSystem = 'macOS';
  else if (ua.includes('Linux')) operatingSystem = 'Linux';
  else if (ua.includes('Android')) operatingSystem = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) operatingSystem = 'iOS';

  const screenSize = `${window.innerWidth}x${window.innerHeight}`;

  return { deviceType, browser, operatingSystem, screenSize };
};

export const AnalyticsProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState('');
  const activeTimeRef = useRef(0);
  const lastUserActivityRef = useRef(Date.now());
  const eventBufferRef = useRef([]);
  const sectionTimersRef = useRef({}); // section -> { startTime, totalSpent, firstViewed }
  const observerRef = useRef(null);

  // 1. Initialize Visitor & Session
  useEffect(() => {
    // Exclude admin control room routes from being tracked as public portfolio visitors
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin') || currentPath.startsWith('/my-space')) {
      return;
    }

    let visitorId = localStorage.getItem('portfolio_visitor_id');
    let isReturning = true;

    if (!visitorId) {
      visitorId = generateId('v');
      localStorage.setItem('portfolio_visitor_id', visitorId);
      isReturning = false;
    }

    const currentSessionId = generateId('s');
    setSessionId(currentSessionId);

    const deviceInfo = detectDeviceInfo();
    let referrer = document.referrer || 'Direct';

    // Parse URL parameters for referrer query info (e.g. ?utm_source=linkedin)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || urlParams.get('ref') || urlParams.get('source');
      if (utmSource) {
        referrer = `https://${utmSource}.com`;
      }
    } catch (e) {}

    const landingPage = window.location.pathname || '/';

    const payload = {
      sessionId: currentSessionId,
      visitorId,
      isReturningVisitor: isReturning,
      ...deviceInfo,
      referrer,
      landingPage
    };

    if (import.meta.env.DEV) {
      console.log('[Analytics] Initialized visitor session:', currentSessionId, payload);
    }

    // Non-blocking asynchronous session initialization
    try {
      fetch(buildApiUrl('/analytics/session'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch((err) => {
        if (import.meta.env.DEV) console.warn('[Analytics Error] startSession fetch failed:', err);
      });
    } catch (e) {
      // Silent failure
    }

    // 2. Activity listeners & active time counter
    const handleUserActivity = () => {
      const now = Date.now();
      // 30 minute inactivity timeout check (1800000 ms)
      if (now - lastUserActivityRef.current > 30 * 60 * 1000) {
        // Reset to new session if returning after 30+ min idle
        const newSessionId = generateId('s');
        setSessionId(newSessionId);
        activeTimeRef.current = 0;
      }
      lastUserActivityRef.current = now;
    };

    const eventsToListen = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    eventsToListen.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

    // Active duration ticker (increments active time when window focused and recently active)
    const activeTicker = setInterval(() => {
      const isFocused = document.hasFocus();
      const isActiveRecently = (Date.now() - lastUserActivityRef.current) < 60000;
      if (isFocused && isActiveRecently) {
        activeTimeRef.current += 1;
      }
    }, 1000);

    // Periodic Heartbeat every 30s
    const heartbeatTicker = setInterval(() => {
      if (!currentSessionId) return;
      try {
        fetch(buildApiUrl('/analytics/heartbeat'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: currentSessionId,
            activeTimeSeconds: activeTimeRef.current,
            exitPage: window.location.pathname
          })
        }).catch(() => {});
      } catch (e) {}
    }, 30000);

    // Periodic Event Buffer Flush every 15s
    const flushTicker = setInterval(() => {
      flushEvents(currentSessionId);
    }, 15000);

    // Page Unload / Hide Flush via sendBeacon
    const handleVisibilityOrUnload = () => {
      if (document.visibilityState === 'hidden' || document.visibilityState === 'unloaded') {
        flushEvents(currentSessionId, true);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityOrUnload);
    window.addEventListener('beforeunload', handleVisibilityOrUnload);

    return () => {
      eventsToListen.forEach(evt => window.removeEventListener(evt, handleUserActivity));
      clearInterval(activeTicker);
      clearInterval(heartbeatTicker);
      clearInterval(flushTicker);
      window.removeEventListener('visibilitychange', handleVisibilityOrUnload);
      window.removeEventListener('beforeunload', handleVisibilityOrUnload);
      flushEvents(currentSessionId, true);
    };
  }, []);

  // Flush buffer to server
  const flushEvents = (activeSessionId, isUnload = false) => {
    const sId = activeSessionId || sessionId;
    if (!sId || eventBufferRef.current.length === 0) return;

    const eventsToSend = [...eventBufferRef.current];
    eventBufferRef.current = []; // Clear buffer

    const payload = JSON.stringify({
      sessionId: sId,
      events: eventsToSend
    });

    if (import.meta.env.DEV) {
      console.log(`[Analytics] Flushing ${eventsToSend.length} events for #${sId}:`, eventsToSend);
    }

    try {
      if (isUnload && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(buildApiUrl('/analytics/events'), blob);
      } else {
        fetch(buildApiUrl('/analytics/events'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    } catch (e) {
      // Silent fail
    }
  };

  // Helper to record interaction events (e.g. view resume, download resume, github, linkedin)
  const trackInteraction = (action, targetName = '', section = 'General', metadata = {}) => {
    if (!sessionId) return;
    const event = {
      eventType: 'interaction',
      action,
      targetName,
      section,
      timestamp: new Date().toISOString(),
      metadata
    };
    eventBufferRef.current.push(event);

    if (import.meta.env.DEV) {
      console.log(`[Analytics Track] ${action} (${targetName}):`, event);
    }

    if (eventBufferRef.current.length >= 5) {
      flushEvents(sessionId);
    }
  };

  // 3. Setup IntersectionObserver for Section Tracking
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    observerRef.current = new IntersectionObserver((entries) => {
      const now = Date.now();
      entries.forEach(entry => {
        const sectionName = entry.target.getAttribute('data-section') || entry.target.id;
        if (!sectionName) return;

        if (entry.isIntersecting) {
          // Section entered viewport
          if (!sectionTimersRef.current[sectionName]) {
            sectionTimersRef.current[sectionName] = {
              startTime: now,
              firstViewedAt: new Date().toISOString(),
              totalSpent: 0,
              recordedFirstView: false
            };
          } else {
            sectionTimersRef.current[sectionName].startTime = now;
          }

          // Record first view event if not recorded yet
          if (!sectionTimersRef.current[sectionName].recordedFirstView) {
            sectionTimersRef.current[sectionName].recordedFirstView = true;
            eventBufferRef.current.push({
              eventType: 'section_view',
              section: sectionName,
              action: 'section_reached',
              firstViewedAt: sectionTimersRef.current[sectionName].firstViewedAt,
              timestamp: new Date().toISOString(),
              timeSpentSeconds: 0
            });
          }
        } else {
          // Section left viewport
          const timerData = sectionTimersRef.current[sectionName];
          if (timerData && timerData.startTime) {
            const spent = Math.max(1, Math.round((now - timerData.startTime) / 1000));
            timerData.totalSpent += spent;
            timerData.startTime = null;

            eventBufferRef.current.push({
              eventType: 'section_view',
              section: sectionName,
              action: 'section_leave',
              firstViewedAt: timerData.firstViewedAt,
              timestamp: new Date().toISOString(),
              timeSpentSeconds: spent
            });

            if (eventBufferRef.current.length >= 5) {
              flushEvents(sessionId);
            }
          }
        }
      });
    }, { threshold: 0.25 }); // 25% visible threshold

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sessionId]);

  // Method for components to attach IntersectionObserver to section elements
  const registerSectionRef = (node, sectionName) => {
    if (node && observerRef.current) {
      node.setAttribute('data-section', sectionName);
      observerRef.current.observe(node);
    }
  };

  return (
    <AnalyticsContext.Provider value={{ sessionId, trackInteraction, registerSectionRef }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
