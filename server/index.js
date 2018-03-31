const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const dbConfig = {
  name: "cryptoklout",
  url: "mongodb://mongodb:27017"
};

const app = express();

const port = 3002;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(dbConfig.url, (err, client) => {
  if (err) {
    return console.log(err);
  }
  const db = client.db(dbConfig.name);

  require("./app/routes")(app, db);

  app.listen(port, () => {
    console.log("We are live on " + port);
  });
});
