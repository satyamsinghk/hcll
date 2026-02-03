const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // In production, env vars are injected directly, so no .env file is needed.
  if (process.env.NODE_ENV !== 'production') {
     console.log("⚠️  .env file not found  ⚠️");
  }
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  databaseURL: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  api: {
    prefix: '/api',
  },
};
