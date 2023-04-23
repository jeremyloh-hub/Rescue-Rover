var express = require("express");
var router = express.Router();
const dogCtrl = require("../controllers/dogs");
const userCtrl = require("../controllers/users");

router.get("/", dogCtrl.showDogs);
router.post("/new");
router.put("/:id/edit", dogCtrl.editDogPost);
router.get("/postform/:id", dogCtrl.getSelectedPost);
router.get("/:dogName", dogCtrl.showSelectedDogs);
module.exports = router;
