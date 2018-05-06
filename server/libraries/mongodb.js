'use strict';

const debug = require('debug')('crypto:db');
const mongoose = require('mongoose');
const config = require('../config');

const { DB_NAME, DB_URI } = config;

const connect = async (retry) => {
  debug(`Connecting to MongoDB: uri: ${DB_URI}, name: ${DB_NAME}`);

  try {
    await mongoose.connect(`${DB_URI}/${DB_NAME}`);
    debug(`MongoDB connected`);
  } catch (err) {
    if (!retry && err.message && err.message.includes('on first connect')) {
      debug('Failed to connect on first try, attempting one more time...');
      setTimeout(() => connect(true), 3000);
    } else {
      debug(`MongoDB connection error: ${err}`);
      process.exit(1);
    }
  }
  // Get Mongoose to use the global promise library
  mongoose.Promise = global.Promise;
};

module.exports = {
  connect,
};
