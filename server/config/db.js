const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Initial connection error: ${error.message}`);
    console.log('[MongoDB] Running server in standard mode. Connect your MONGODB_URI in .env to persist updates to Atlas.');
  }
};

module.exports = connectDB;
