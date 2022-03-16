const Token = require("../models/Token");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
	attatchedToken = req.headers.token;

	// no token
	if (!attatchedToken) {
		req.auth = { isAuthenticated: false };
		return next();
	}

	// check token
	const token = await Token.findOne({ value: attatchedToken });
	if (!token) {
		req.auth = { isAuthenticated: false };
		return next();
	}

	// check ip and time
	const expired = Date.parse(token.validTill) < Date.now();
	if (token.ip !== req.ip || expired) {
		req.auth = { isAuthenticated: false };
		return next();
	} else {
		req.auth = {
			isAuthenticated: true,
			user: await User.findById(token.user),
		};
		return next();
	}
}

module.exports = authMiddleware;
