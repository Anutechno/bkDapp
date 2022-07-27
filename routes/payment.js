var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');
const router = express.Router();
const {paymentRequest,GetAllPayment,Cashpayment,GetPayment, paymentResponse,paymentInvoices,payment,GetPaymentOrder} = require("../controller/payment")

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
router.post('/pay',payment);
router.post('/cash',Cashpayment);
router.get('/pay_order/:id',GetPaymentOrder);
router.get('/getall',GetAllPayment);
router.get('/get/:id',GetPayment);



module.exports = router;
