const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const cors = require('cors');
const debug = require('debug')('crypto:express');
const config = require('./config');
const db = require('./libraries/mongodb');

const routes = require('./router');

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger(config.LOG_LEVEL));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.connect();

// test route
app.get('/', (req, res) => {
  res.json({message: "All Good!"});
});

app.use('/users', routes);

// catch all error handler
app.use((err, req, res, next) => {
  const route = (req && req.originalUrl) || 'no original url';
  debug(`api error: ${route}: ${err}`);
  next();
});

module.exports = app;
