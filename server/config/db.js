const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';
    const conn = await mongoose.connect(connStr, { serverSelectionTimeoutMS: 5000 });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Initial connection error: ${error.message}`);
    console.log('[MongoDB] Running server. Configure valid MONGODB_URI in .env to persist updates.');
  }
};

module.exports = connectDB;
