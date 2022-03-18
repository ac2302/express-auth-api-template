const mongoose = require("mongoose");
const config = require("../config");

const otpSchema = mongoose.Schema(
	{
		value: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		validTill: {
			type: Date,
			default: Date.now() + config.auth.otp.validFor,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("OTP", otpSchema);
