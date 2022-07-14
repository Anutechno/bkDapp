var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');
const router = express.Router();
const {gettracking, updatetracking} = require("../controller/trackings")

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `./upload/tracking`;
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({ storage });

/* POST users listing. */
router.get('/trackbooking/:id',gettracking)
router.put('/updatetracking/:id',updatetracking)


module.exports = router;
