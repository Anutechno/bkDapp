var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');

var { addmanufacture, manufacturelist, deletemanufacture, editmanufacture } =  require('../controller/manufacture');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `./upload/manufacture`;
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({ storage });

/* POST users listing. */
router.post('/addmanufacture',upload.fields([{ name: 'manufacture_image', maxCount: 1}]),addmanufacture);
router.get('/manufacturelist',manufacturelist);
router.delete('/deletemanufacture',deletemanufacture); 
router.put('/editmanufacture',upload.fields([{ name: 'manufacture_image', maxCount: 1}]),editmanufacture);




module.exports = router;
