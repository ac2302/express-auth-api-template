require("dotenv").config();

module.exports = {
	server: {
		port: process.env.PORT || 5000,
	},
	db: {
		string: process.env.DB_STRING,
	},
	auth: {
		roles: {
			list: ["user", "admin"],
			default: "user",
		},
		password: {
			length: {
				min: 8,
				max: 128,
			},
			hashingRounds: 10,
		},
		token: {
			validFor: 1000 * 60 * 60 * 24 * 7, // 1 week
			length: 32,
		},
	},
};
