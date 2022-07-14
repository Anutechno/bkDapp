var express = require("express");
var multer = require("multer");
var fs = require("fs-extra");

var {
  addAdditionalOption,
  additionalList,
  updateAdditional,
  deleteAdditional,
} = require("../controller/additionalOptionscontroller");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var path = `./upload/additional`;
    fs.mkdirsSync(path);
    callback(null, path);
  },
  filename(req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

/* POST users listing. */
router.post("/addAdditionalOption", addAdditionalOption);
router.get("/additionalList", additionalList);
router.put("/updateAdditional", updateAdditional);
router.delete("/deleteAdditional", deleteAdditional);

module.exports = router;
