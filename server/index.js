const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const dbConfig = {
  name: "cryptoklout",
  url: "mongodb://mongodb:27017"
};
const dbOptions = {
  reconnectTries: 30,
  reconnectInterval: 1000
};

function createConnection(dbURL, options) {
  var db = mongoose.createConnection(dbURL, options);

  db.on("error", function(err) {
    // If first connect fails because mongod is down, try again later.
    // This is only needed for first connect, not for runtime reconnects.
    // See: https://github.com/Automattic/mongoose/issues/5169
    if (
      err.message &&
      err.message.match(/failed to connect to server .* on first connect/)
    ) {
      console.log(new Date(), String(err));

      // Wait for a bit, then try to connect again
      setTimeout(function() {
        console.log("Retrying first connect...");
        db.openUri(dbURL).catch(() => {});
        // Why the empty catch?
        // Well, errors thrown by db.open() will also be passed to .on('error'),
        // so we can handle them there, no need to log anything in the catch here.
        // But we still need this empty catch to avoid unhandled rejections.
      }, 20 * 1000);
    } else {
      // Some other error occurred.  Log it.
      console.error(new Date(), String(err));
    }
  });

  db.once("open", function() {
    console.log("Connection to db established.");
  });

  return db;
}

const app = express();

const port = 3002;

app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Attempt to connect to MongoDB, retry on first attempt because the driver does not do this for us.
 */
function connectWithRetry() {
  return MongoClient.connect(dbConfig.url, (err, client) => {
    if (err) {
      if (
        err.message &&
        err.message.match(/failed to connect to server .* on first connect/)
      ) {
        console.warn(
          "Failed to connect to mongo on startup - retrying in 5 sec"
        );
        setTimeout(connectWithRetry, 5000);
      } else {
        console.error("Something went terribly wrong connecting to mongo", err);
      }
    } else {
      const db = client.db(dbConfig.name);

      require("./app/routes")(app, db);

      app.listen(port, () => {
        console.log("We are live on " + port);
      });
    }
  });
}

connectWithRetry();
