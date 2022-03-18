const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Token = require("../models/Token");
const OTP = require("../models/OTP");
const sendMail = require("../utils/sendMail");
const config = require("../config");
const getRandomString = require("../utils/getRandomString");

// register
router.post("/register", async (req, res) => {
	const user = req.body.user;

	// missing details
	if (!user) return res.status(400).json({ msg: "missing user in body" });
	if (!(user.username && user.password && user.email))
		return res.status(400).json({ msg: "missing username, password or email" });

	// invalid details
	if ((await User.find({ username: user.username })).length > 0)
		return res.status(400).json({ msg: "username is taken" });
	if ((await User.find({ email: user.email })).length > 0)
		return res.status(400).json({
			msg: "this email address is already registered with another account",
		});
	if (
		user.password.length < config.auth.password.length.min ||
		user.password > config.auth.password.length.max
	)
		return res.json({
			err: `password should be between ${config.auth.password.length.min} and ${config.auth.password.length.max} characters`,
		});

	try {
		// hashing password
		const salt = bcrypt.genSaltSync(config.auth.password.hashingRounds);
		user.password = bcrypt.hashSync(user.password, salt);

		const newUser = new User(user);
		return res.send(await newUser.save());
	} catch (err) {
		return res.status(500).json({ err });
	}
});

// checking if user exists
router.get("/exists/:username", async (req, res) => {
	const foundUsers = await User.find({ username: req.params.username });
	if (foundUsers.length === 0) return res.json({ exists: false });
	else return res.json({ exists: true });
});

// login
router.post("/login", async (req, res) => {
	const user = req.body.user;

	// missing details
	if (!user) return res.status(400).json({ msg: "missing user in body" });
	if (!(user.username && user.password))
		return res.status(400).json({ msg: "missing username or password" });

	// looking for user
	const foundUsers = await User.find({ username: user.username });
	if (foundUsers.length === 0)
		return res.status(404).json({ msg: "user not found" });
	const foundUser = foundUsers[0];

	// comparing passwords
	if (!bcrypt.compareSync(user.password, foundUser.password))
		return res.status(400).json({ msg: "incorrect password" });

	// generating token
	let tokenValue = "";
	while (true) {
		tokenValue = getRandomString(config.auth.token.length);
		const tokens = await Token.find({ value: tokenValue });
		if (tokens.length === 0) break;
	}

	const token = new Token({ value: tokenValue, user: foundUser, ip: req.ip });
	await token.save();

	res.json({ token: tokenValue });
});

// generate otp
router.post("/generate-otp", async (req, res) => {
	const user = req.body.user;

	// missing details
	if (!user) return res.status(400).json({ msg: "missing user in body" });
	if (!user.email) return res.status(400).json({ msg: "missing email" });

	// finding user with email
	const foundUser = await User.findOne({ email: user.email });

	if (!foundUser)
		return res
			.status(404)
			.json({ msg: `no user registered with email ${user.email}` });

	// generate otp
	try {
		const otp = getRandomString(config.auth.otp.length);
		const newOTP = new OTP({
			value: otp,
			user: foundUser,
		});
		newOTP.save();

		// sending otp
		const emailBody = `Hello ${foundUser.username}
		<hr />
		Your OTP is <em>${otp}</em>
		<br />
		It is valid for 30 min after generation. i.e till ${newOTP.validTill}`;

		await sendMail(foundUser.email, "One Time Password", emailBody);
		res.json({ msg: `OTP sent to ${foundUser.email}` });
	} catch (err) {
		return res.status(500).json({ msg: "error generating and sending OTP" });
	}
});

module.exports = router;
