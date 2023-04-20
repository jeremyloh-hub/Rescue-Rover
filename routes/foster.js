const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");
const fosterCtrl = require("../controllers/foster");

router.post("/", fosterCtrl.addFoster);
router.get("/", fosterCtrl.checkFosterForm);

module.exports = router;
