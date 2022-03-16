const mongoose = require("mongoose");
const config = require("../config");

const tokenSchema = mongoose.Schema(
	{
		value: {
			type: String,
			required: true,
			unique: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		ip: {
			type: String,
			required: true,
		},
		validTill: {
			type: Date,
			default: Date.now() + config.auth.token.validFor,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
