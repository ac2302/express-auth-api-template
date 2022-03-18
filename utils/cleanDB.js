const OTP = require("../models/OTP");
const Token = require("../models/Token");

async function cleanDB() {
	const now = Date.now();
	const otps = await OTP.find();
	const tokens = await Token.find();

	otps.forEach((otp) => {
		if (Date.parse(otp.validTill) < now) {
			otp.delete();
		}
	});

	tokens.forEach((token) => {
		if (Date.parse(token.validTill) < now) {
			otp.delete();
		}
	});
}

module.exports = cleanDB;
