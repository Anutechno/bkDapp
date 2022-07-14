var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');

var { customersignup, customerlist, deletecustomer, editcustomer,getcustomer} =  require('../controller/customers');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `./upload/profile`;
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({ storage });

/* POST users listing. */
router.post('/customersignup',customersignup);
router.get('/customerlist',customerlist);
router.get('/customer/:id',getcustomer);
router.delete('/deletecustomer',deletecustomer);
router.put('/editcustomer/:id',editcustomer);


//Uploading Single file
router.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    } else{
      console.log('file received');
      return res.send({
        success: true,
        data:file
      })
    }
  })
  
  
//Uploading multiple files
router.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
      const error = new Error('Please choose files')
      error.httpStatusCode = 400
      return next(error)
    }
    else{
        console.log('file received');
        return res.send({
          success: true,
          data:files
        })
      }
})

module.exports = router;
