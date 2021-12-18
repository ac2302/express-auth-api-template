const express = require("express");
const config = require("./config");

const app = express();

app.listen(config.server.port, () => {
	console.log("server live on port " + config.server.port);
});
