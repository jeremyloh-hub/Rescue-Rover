var express = require("express");
var router = express.Router();
const dogCtrl = require("../controllers/dogs");
const userCtrl = require("../controllers/users");

router.get("/", dogCtrl.showDogs);
router.get("/postform/:id", dogCtrl.getSelectedPost);
router.get("/:dogName", dogCtrl.showSelectedDogs);
router.post("/new", dogCtrl.addDogPost);
router.put("/:id/edit", dogCtrl.editDogPost);
router.delete("/:id/delete", dogCtrl.deleteDogPost);
module.exports = router;
