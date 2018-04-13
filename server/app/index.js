const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const cors = require("cors");
const debug = require("debug")("kracken");
const Mongo = require('mongodb').MongoClient;
const config = require("../config");

const app = express();

app.use(helmet());
app.use(cors())
app.use(logger(config.log_level));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

Mongo.connect(config.DB_URI)
  .then(client => {
    const db = client.db(config.DB_NAME);
    app.locals.db = db;
  })
  .catch(error => {
    debug(`Startup error connecting to db: ${error}`);
  });

// test route
app.get("/", (req, res) => {
  res.json(req.app.locals.db.serverConfig.clientInfo);
});

// catch all error handler
app.use(function(err, req, res, next) {
  const route = (req && req.originalUrl) || "no original url";
  debug(`api error: ${route}: ${err}`);
  next();
});

module.exports = app;
