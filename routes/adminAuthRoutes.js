var express = require('express');
var {suadminLogin,suadminsignup} =  require('../controller/adminAuth');
const router = express.Router();

/* POST users listing. */
router.post('/suadminLogin', suadminLogin);
router.post('/suadminsignup', suadminsignup);

module.exports = router;
