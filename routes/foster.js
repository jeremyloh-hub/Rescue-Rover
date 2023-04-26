const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");
const fosterCtrl = require("../controllers/foster");

router.post("/", userCtrl.isAuth, fosterCtrl.addFoster);
router.get("/", userCtrl.isAuth, fosterCtrl.checkFosterForm);
router.get("/status/:id", userCtrl.isAuth, fosterCtrl.showFosterStatus);

module.exports = router;
