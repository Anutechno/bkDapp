var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');

var { addDealer, editDealer, dealerList, deleteDealer,singledealer } =  require('../controller/dealerController');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `./upload/dealer`;
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({ storage });

/* POST users listing. */
router.post('/addDealer', addDealer);
router.put('/editDealer', editDealer);
router.get('/dealerList', dealerList);
router.get('/dealer/:id', singledealer);
// router.post('/addDealer',upload.fields([{ name: 'image', maxCount: 1}]),addBike);
router.delete('/deleteDealer',deleteDealer); 




module.exports = router;
