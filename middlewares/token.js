const config = require("../config");
const Token = require("../models/Token");
const getRandomString = require("../utils/getRandomString");

async function tokenMiddleware(req, res, next) {
	if (req.auth.isAuthenticated) {
		let tokenValue = "";
		while (true) {
			tokenValue = getRandomString(config.auth.token.length);
			const tokens = await Token.find({ value: tokenValue });
			if (tokens.length === 0) break;
		}

		const token = new Token({
			value: tokenValue,
			user: req.auth.user,
			ip: req.ip,
		});
		await token.save();

		res.set("token", tokenValue);
	}

	next();
}

module.exports = tokenMiddleware;
