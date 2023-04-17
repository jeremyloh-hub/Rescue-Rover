var express = require("express");
var router = express.Router();
const dogCtrl = require("../controllers/dogs.tsx");

router.get("/", dogCtrl.showDogs);
router.post("/new", dogCtrl.addDogs);
router.get("/:dogName", dogCtrl.showSelectedDogs);

module.exports = router;
