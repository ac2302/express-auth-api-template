const express = require("express");
const config = require("./config");
const mongoose = require("mongoose");

const app = express();

// middlewares
app.use(express.json());

// connect to db
mongoose.connect(config.db.string, (err) => {
	if (err) console.error(err);
	else console.log("connected to db");
});

// routes
app.use("/auth/", require("./routes/auth"));

app.listen(config.server.port, () => {
	console.log(`server live on port ${config.server.port}`);
});
