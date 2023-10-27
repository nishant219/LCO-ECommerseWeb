const express=require("express");
const router= express.Router();

const {home, dummyhome} = require("../controllers/homeController");

router.route("/").get(home);
router.route("/dummy").get(dummyhome);

module.exports=router;

