require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./utils/socket');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io real-time engine
initSocket(server);

// Connect to Database and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`[Portfolio Server] Listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[Portfolio Server] API base URL: http://localhost:${PORT}/api`);
  });
});
