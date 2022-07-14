
var router = require('express').Router();
var multer = require('multer');
var fs = require('fs-extra');
const {verifyUser} = require("../helper/verifyAuth");

var { usersignin, verifyOTP, logout, getAllVendors,updateVendor} = require("../controller/vendors")

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `./upload/vendors`;
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({ storage });



/* POST users listing. */
router.post('/signin', usersignin);
// router.post('/sendotp',verifyUser, sendOTP);
router.post('/verifyotp',verifyUser, verifyOTP);
router.post('/logout', logout);
router.get('/getAllVendors', getAllVendors);
router.put('/updateVendor', updateVendor);


module.exports = router;