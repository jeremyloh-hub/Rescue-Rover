var express = require("express");
var router = express.Router();
const dogCtrl = require("../controllers/dogs");
const userCtrl = require("../controllers/users");

router.get("/", dogCtrl.showDogs);
router.get("/postform/:id", userCtrl.isAuth, dogCtrl.getSelectedPost);
router.get("/:dogName", dogCtrl.showSelectedDogs);
router.post("/new", userCtrl.isAuth, dogCtrl.addDogPost);
router.put("/:id/edit", userCtrl.isAuth, dogCtrl.editDogPost);
router.delete("/:id/delete", userCtrl.isAuth, dogCtrl.deleteDogPost);
module.exports = router;
