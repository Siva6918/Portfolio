require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./utils/socket');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io real-time engine
initSocket(server);

// Connect to Database
connectDB();

// Start HTTP & Socket server
server.listen(PORT, () => {
  console.log(`[Portfolio Server] Listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`[Portfolio Server] API base URL: http://localhost:${PORT}/api`);
  
  // Keep backend awake by pinging itself every 14 minutes 30 seconds
  const PING_INTERVAL = 14.5 * 60 * 1000; // 870,000 ms
  setInterval(() => {
    const backendUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
    const httpModule = backendUrl.startsWith('https') ? require('https') : require('http');
    httpModule.get(`${backendUrl}/health`, (res) => {
      console.log(`[Keep-Alive] Pinged ${backendUrl}/health - Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`[Keep-Alive] Error pinging ${backendUrl}:`, err.message);
    });
  }, PING_INTERVAL);
});
