const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process in production
  if (process.env.NODE_ENV === 'production') {
     throw new Error("⚠️  Couldn't find .env file  ⚠️");
  } else {
    console.log("⚠️  .env file not found, using defaults  ⚠️");
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
