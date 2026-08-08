require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Portfolio Server] Listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[Portfolio Server] API base URL: http://localhost:${PORT}/api`);
  });
});
