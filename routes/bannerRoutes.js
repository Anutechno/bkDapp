var express = require("express");
var multer = require("multer");
var fs = require("fs-extra");

var {
  addbanner,
  bannerlist,
  deletebanner,
  editbanner,
} = require("../controller/banner");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var path = `./upload/banner`;
    fs.mkdirsSync(path);
    callback(null, path);
  },
  filename(req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

/* POST users listing. */
router.post("/addbanner", addbanner);
router.get("/bannerlist", bannerlist);
router.delete("/deletebanner", deletebanner);
router.put("/editbanner", editbanner);

module.exports = router;
