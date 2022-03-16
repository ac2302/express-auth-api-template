const router = require("express").Router();
const User = require("../models/User");
const authOnlyMiddleware = require("../middlewares/authOnly");
const config = require("../config");

// get self
router.get("/self", authOnlyMiddleware([]), async (req, res) => {
    res.send(req.auth.user)
});

module.exports = router;
