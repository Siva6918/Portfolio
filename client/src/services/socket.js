import { io } from 'socket.io-client';

let socket = null;

/**
 * Get or initialize persistent Socket.io client instance
 */
export const getSocket = () => {
  if (!socket) {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    // Remove /api suffix to connect to base server url
    let socketUrl = window.location.origin;
    if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
      socketUrl = apiUrl.replace(/\/api\/?$/, '');
    }

    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true
    });

    if (import.meta.env.DEV) {
      socket.on('connect', () => {
        console.log('[Socket.io Client] Connected to live channel:', socket.id);
      });
      socket.on('disconnect', (reason) => {
        console.log('[Socket.io Client] Disconnected:', reason);
      });
      socket.on('connect_error', (err) => {
        console.warn('[Socket.io Client] Connection error:', err.message);
      });
    }
  }
  return socket;
};
