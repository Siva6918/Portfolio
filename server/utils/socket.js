const { Server } = require('socket.io');

let io = null;

/**
 * Initialize Socket.io server with CORS configuration
 * @param {import('http').Server} httpServer 
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Allow all local dev and production portfolio domains
        callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 20000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Socket.io] Client connected: ${socket.id}`);
    }

    socket.on('subscribe:analytics', () => {
      socket.join('analytics_room');
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Socket.io] Client #${socket.id} subscribed to analytics_room`);
      }
    });

    socket.on('unsubscribe:analytics', () => {
      socket.leave('analytics_room');
    });

    socket.on('disconnect', (reason) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Socket.io] Client disconnected: ${socket.id} (${reason})`);
      }
    });
  });

  console.log('[Socket.io] Real-time engine initialized successfully.');
  return io;
};

/**
 * Get active Socket.io instance
 */
const getIO = () => io;

/**
 * Broadcast an analytics:update event to all active dashboard subscribers
 * @param {object} payload 
 */
const emitAnalyticsUpdate = (payload = {}) => {
  if (!io) return;
  try {
    const data = {
      timestamp: new Date().toISOString(),
      ...payload
    };
    // Emit to both room and broadcast for resilience
    io.to('analytics_room').emit('analytics:update', data);
    io.emit('analytics:update', data);
  } catch (error) {
    console.error('[Socket.io Error] emitAnalyticsUpdate:', error.message);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitAnalyticsUpdate
};
