const router = require("express").Router();
const User = require("../models/User");
const authOnlyMiddleware = require("../middlewares/authOnly");
const filterData = require("../utils/filterData");
const config = require("../config");

// get self
router.get("/self", authOnlyMiddleware([]), async (req, res) => {
	res.send(req.auth.user);
});

// get user by id
router.get("/:id", async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).json({ msg: "user not found" });
	res.json(user);
});

// get user by username
router.get("/byusername/:username", async (req, res) => {
	const user = await User.findOne({ username: req.params.username });
	if (!user) return res.status(404).json({ msg: "user not found" });
	res.json(user);
});

// get all users
router.get("/", authOnlyMiddleware(["admin"]), async (req, res) => {
	const users = await User.find();
	res.send(filterData(users, req.query));
});

// patch user
router.patch("/:id", authOnlyMiddleware(["admin"]), async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) return res.status(404).json({ msg: "user not found" });

		const props = Object.getOwnPropertyNames(req.body);
		props.forEach((prop) => {
			user[prop] = req.body[prop];
		});
		res.json(await user.save());
	} catch (err) {
		res.status(500).json({ err });
	}
});

module.exports = router;
