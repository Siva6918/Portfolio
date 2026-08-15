import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { buildApiUrl } from '../services/api';

const AnalyticsContext = createContext({
  sessionId: '',
  trackInteraction: () => {},
  registerSectionRef: () => {}
});

export const useAnalytics = () => useContext(AnalyticsContext);

// Utility to generate compact random ID (e.g. s_A8F3 or v_8f2a)
const generateId = (prefix = 's') => {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_${result}`;
};

// Generate unique event ID
const generateEventId = () => {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
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
  const sectionTimersRef = useRef({}); // section -> { startTime, totalSpent, recordedFirstView }
  const observerRef = useRef(null);
  const hasInitializedSessionRef = useRef(false);
  const lastInteractionRef = useRef({ signature: '', timestamp: 0 });

  // Flush buffer to server (declared with useCallback for stable reference)
  const flushEvents = useCallback((activeSessionId, isUnload = false) => {
    const sId = activeSessionId || sessionId;
    if (!sId || eventBufferRef.current.length === 0) return;

    const eventsToSend = [...eventBufferRef.current];
    eventBufferRef.current = []; // Clear buffer immediately to prevent duplicate sends

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
  }, [sessionId]);

  // 1. Initialize Visitor & Session
  useEffect(() => {
    // Exclude admin control room routes from being tracked as public portfolio visitors
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin') || currentPath.startsWith('/my-space')) {
      return;
    }

    // Persist visitor ID in localStorage across browser restarts
    let visitorId = localStorage.getItem('portfolio_visitor_id');
    let isReturning = true;

    if (!visitorId) {
      visitorId = generateId('v');
      localStorage.setItem('portfolio_visitor_id', visitorId);
      isReturning = false;
    }

    // Persist session ID in sessionStorage across page views within current browser tab
    let currentSessionId = sessionStorage.getItem('portfolio_session_id');
    if (!currentSessionId) {
      currentSessionId = generateId('s');
      sessionStorage.setItem('portfolio_session_id', currentSessionId);
    }
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

    // Deduplicate initialization caused by React 18 StrictMode double-mounting
    if (!hasInitializedSessionRef.current) {
      hasInitializedSessionRef.current = true;

      if (import.meta.env.DEV) {
        console.log('[Analytics] Initialized visitor session:', currentSessionId, payload);
      }

      // Send non-blocking session initialization
      try {
        fetch(buildApiUrl('/analytics/session'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch((err) => {
          if (import.meta.env.DEV) console.warn('[Analytics Error] startSession fetch failed:', err);
        });
      } catch (e) {}
    }

    // 2. Activity listeners & active time counter
    const handleUserActivity = () => {
      const now = Date.now();
      // 30 minute inactivity timeout check (1800000 ms)
      if (now - lastUserActivityRef.current > 30 * 60 * 1000) {
        // Reset to new session if returning after 30+ min idle
        const newSessionId = generateId('s');
        sessionStorage.setItem('portfolio_session_id', newSessionId);
        setSessionId(newSessionId);
        activeTimeRef.current = 0;
      }
      lastUserActivityRef.current = now;
    };

    const eventsToListen = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    eventsToListen.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

    // Active duration ticker (increments active time when window focused and recently active)
    const activeTicker = setInterval(() => {
      const isFocused = typeof document.hasFocus === 'function' ? document.hasFocus() : true;
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
      if (document.visibilityState === 'hidden') {
        flushEvents(currentSessionId, true);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityOrUnload);
    window.addEventListener('pagehide', handleVisibilityOrUnload);
    window.addEventListener('beforeunload', handleVisibilityOrUnload);

    return () => {
      eventsToListen.forEach(evt => window.removeEventListener(evt, handleUserActivity));
      clearInterval(activeTicker);
      clearInterval(heartbeatTicker);
      clearInterval(flushTicker);
      window.removeEventListener('visibilitychange', handleVisibilityOrUnload);
      window.removeEventListener('pagehide', handleVisibilityOrUnload);
      window.removeEventListener('beforeunload', handleVisibilityOrUnload);
      flushEvents(currentSessionId, true);
    };
  }, [flushEvents]);

  // Helper to record interaction events with client-side 500ms debounce deduplication
  const trackInteraction = useCallback((action, targetName = '', section = 'General', metadata = {}) => {
    const sId = sessionId || sessionStorage.getItem('portfolio_session_id');
    if (!sId) return;

    // Deduplicate rapid identical double-clicks (within 500ms)
    const now = Date.now();
    const signature = `${action}_${targetName}_${section}`;
    if (
      lastInteractionRef.current.signature === signature &&
      (now - lastInteractionRef.current.timestamp) < 500
    ) {
      return;
    }
    lastInteractionRef.current = { signature, timestamp: now };

    const event = {
      eventId: generateEventId(),
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

    if (eventBufferRef.current.length >= 4) {
      flushEvents(sId);
    }
  }, [sessionId, flushEvents]);

  // 3. Setup IntersectionObserver for Section Tracking (~50% threshold)
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    observerRef.current = new IntersectionObserver((entries) => {
      const now = Date.now();
      const sId = sessionId || sessionStorage.getItem('portfolio_session_id');
      if (!sId) return;

      entries.forEach(entry => {
        const sectionName = entry.target.getAttribute('data-section') || entry.target.id;
        if (!sectionName) return;

        if (entry.isIntersecting) {
          // Section entered viewport (crossed ~50% threshold)
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

          // Record first view event once per section
          if (!sectionTimersRef.current[sectionName].recordedFirstView) {
            sectionTimersRef.current[sectionName].recordedFirstView = true;
            eventBufferRef.current.push({
              eventId: generateEventId(),
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

            // Only log leave event if meaningful time spent (> 1 sec)
            if (spent >= 1) {
              eventBufferRef.current.push({
                eventId: generateEventId(),
                eventType: 'section_view',
                section: sectionName,
                action: 'section_leave',
                firstViewedAt: timerData.firstViewedAt,
                timestamp: new Date().toISOString(),
                timeSpentSeconds: spent
              });

              if (eventBufferRef.current.length >= 4) {
                flushEvents(sId);
              }
            }
          }
        }
      });
    }, { threshold: 0.50 }); // 50% visible threshold per Phase 1 spec

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sessionId, flushEvents]);

  // Method for components to attach IntersectionObserver to section elements
  const registerSectionRef = useCallback((node, sectionName) => {
    if (node && observerRef.current) {
      node.setAttribute('data-section', sectionName);
      observerRef.current.observe(node);
    }
  }, []);

  return (
    <AnalyticsContext.Provider value={{ sessionId, trackInteraction, registerSectionRef }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
