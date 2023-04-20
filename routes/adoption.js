const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");
const adoptCtrl = require("../controllers/adoption");

router.post("/", adoptCtrl.addAdoption);
router.get("/", adoptCtrl.checkAdoptionForm);

module.exports = router;
