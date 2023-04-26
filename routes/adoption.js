const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");
const adoptCtrl = require("../controllers/adoption");

router.post("/", userCtrl.isAuth, adoptCtrl.addAdoption);
router.get("/", userCtrl.isAuth, adoptCtrl.checkAdoptionForm);
router.get("/status/:id", userCtrl.isAuth, adoptCtrl.showAdoptionStatus);

module.exports = router;
