var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');

var { addservice, servicelist, updateservice , deleteService, singleservice} =  require('../controller/service');
var {PicknDrop} = require("../controller/pickupndrop")
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `./upload/service`;
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({ storage });

/* POST users listing. */
router.post('/addservice',upload.fields([{ name: 'service_image', maxCount: 1}]),addservice);
router.get('/servicelist',servicelist)
router.put('/updateservice',upload.fields([{ name: 'service_image', maxCount: 1}]),updateservice)
router.delete('/deleteService',deleteService)
router.get('/service/:id',singleservice)
router.post('/PicknDrop',PicknDrop)


module.exports = router;
