const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");

router.post("/signup", userCtrl.create);
router.post("/login", userCtrl.login);

module.exports = router;
