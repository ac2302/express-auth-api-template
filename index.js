const express = require("express");
const config = require("./config");
const mongoose = require("mongoose");

const app = express();

// connect to db
mongoose.connect(config.db.string, (err) => {
  if (err) console.error(err);
  else console.log("connected to db");
});

app.listen(config.server.port, () => {
  console.log(`server live on port ${config.server.port}`);
});
