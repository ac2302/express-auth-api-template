const mongoose = require("mongoose");
const config = require("../config");

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: "user",
			enum: config.auth.roles,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
