const express = require("express");
const config = require("./config");
const mongoose = require("mongoose");
const authMiddleware = require("./middlewares/auth");

const app = express();

// middlewares
app.use(express.json());

// custom middlewares
app.use(authMiddleware);

// connect to db
mongoose.connect(config.db.string, (err) => {
	if (err) console.error(err);
	else console.log("connected to db");
});

// routes
app.use("/auth/", require("./routes/auth"));
app.use("/user/", require("./routes/user"));


app.listen(config.server.port, "0.0.0.0", () => {
	console.log(`server live on port ${config.server.port}`);
});
