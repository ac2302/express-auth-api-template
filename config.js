require("dotenv").config();

module.exports = {
	server: {
		port: process.env.PORT || 5000,
	},
	db: {
		string: process.env.DB_STRING,
	},
	password: {
		length: {
			min: 8,
			max: 128,
		},
		hashingRounds: 10,
	},
};
