const debug = require('debug')('app:db');
const mongoose = require('mongoose');
const config = require('../config');

const { DB_NAME, DB_URI } = config;

const connect = () => {
  debug(`Connecting to MongoDB: uri: ${DB_URI}, name: ${DB_NAME}`)
  mongoose.connect(`${DB_URI}/${DB_NAME}`);

// Get Mongoose to use the global promise library
  mongoose.Promise = global.Promise;
//Get the default connection
  const db = mongoose.connection;


  db.on('connected', () => debug(`MongoDB connected`));
  db.on('error', (err) => debug(`MongoDB connection error: ${err}`));
};

module.exports = {
  connect,
};
