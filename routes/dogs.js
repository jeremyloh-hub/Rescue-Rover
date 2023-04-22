var express = require("express");
var router = express.Router();
const dogCtrl = require("../controllers/dogs");
const userCtrl = require("../controllers/users");

router.get("/", dogCtrl.showDogs);
router.post("/new");
router.put("/:dogName/edit", dogCtrl.editDogPost);
router.get("/:dogName", dogCtrl.showSelectedDogs);
router.get("/postform/:dogName", dogCtrl.getSelectedPost);

module.exports = router;
