var express = require("express");
var multer = require("multer");
var fs = require("fs-extra");

var {
  addBike,
  bikeList,
  editBike,
  deleteBike,
  uservehicleList,
} = require("../controller/bikeController");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var path = `./upload/bike`;
    fs.mkdirsSync(path);
    callback(null, path);
  },
  filename(req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

/* POST users listing. */
router.post("/addBike", addBike);
router.get("/bikeList", bikeList);
router.put("/editBike/:id", editBike);
router.delete("/deleteBike", deleteBike);
router.get("/uservehicleList", uservehicleList);

uservehicleList
module.exports = router;
