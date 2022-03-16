require("dotenv").config();

module.exports = {
	server: {
		port: process.env.PORT || 5000,
	},
	db: {
		string: process.env.DB_STRING,
	},
	auth: {
		roles: ["user", "admin"],
		password: {
			length: {
				min: 8,
				max: 128,
			},
			hashingRounds: 10,
		},
	},
};
