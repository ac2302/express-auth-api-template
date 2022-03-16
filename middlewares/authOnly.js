const res = require("express/lib/response");
const config = require("../config");

function authOnlyMiddleware(roles) {
	const middleware = (req, res, next) => {
		if (!req.auth.isAuthenticated)
			return res
				.status(401)
				.json({ msg: "you must be logged in to access this route" });

		if (roles.length === 0) return next();

		let allowed = false;

		roles.forEach((role) => {
			console.log(role, req.auth.user.role);

			if (!config.auth.roles.list.includes(role)) {
				console.error(`invalid role ${role}`);
				return res.status(500).json({ msg: "invalid user role" });
			}

			if (role == req.auth.user.role) {
				console.log("go ahead");
				allowed = true;
				return next();
			}
		});

		if (!allowed)
			return res
				.status(403)
				.json({
					msg: `you must be ${roles.join(" or ")} to access this route`,
				});
	};

	return middleware;
}

module.exports = authOnlyMiddleware;
