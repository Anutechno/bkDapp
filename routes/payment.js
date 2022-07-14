var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');
const router = express.Router();
const {paymentRequest, paymentResponse,paymentInvoices} = require("../controller/payment")

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `./upload/payment`;
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({ storage });

/* POST users listing. */
router.post('/paymentrequest',paymentRequest);
router.post('/paymentresponse',paymentResponse);
router.get('/Invoices',paymentInvoices);



module.exports = router;
