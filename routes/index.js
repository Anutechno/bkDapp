const express = require('express');
const  { verifyToken } = require('../helper/verifyAuth');
const router = express.Router();

var genrateToken = require('./tokenRoute');
var adminauth = require('./adminAuthRoutes');
var employee = require('./employeeRoutes');
var customers = require('./customerRoutes');
var manufacture = require('./manufactureRoutes');
var service = require('./serviceRoutes');
var servicefeature = require('./servicefeatureRoute');
var bikes = require('./bikeRoutes');
var locations = require('./locationsRoutes');
var dealers = require('./dealerRoutes');
var userauth = require('./userAuthRoutes');
var banner = require('./bannerRoutes');
var offer = require('./offerRoutes');
var additionalOption = require('./additionalOptionsRoute');
var vendor = require('./vendorRoute');
var servicesalientfeature = require("./service_Salient_feature_Route")
var booking = require("./bookingRoutes")
var tracking = require("./trackingRoute")
var pickndrop = require("./pickupndrop")
var payment = require("./payment")
var statencity = require("./StatenCity")
var bank = require("./bankroute")


// User App Admin
router.use('/tokenGenrate',genrateToken);
router.use('/adminauth',verifyToken,adminauth);
router.use('/employee',verifyToken,employee);
router.use('/customers',verifyToken,customers);
router.use('/manufacture',verifyToken,manufacture);
router.use('/service',verifyToken,service);
router.use('/servicefeature',verifyToken,servicefeature);
router.use('/servicesalientfeature',verifyToken,servicesalientfeature);
router.use('/bike',verifyToken,bikes);
router.use('/locations',verifyToken,locations);
router.use('/dealer',verifyToken,dealers);
router.use('/userAuth',verifyToken, userauth);
router.use('/banner',verifyToken,banner);
router.use('/offer',verifyToken,offer);
router.use('/additionalOptions',verifyToken,additionalOption);
router.use('/bookings',verifyToken,booking);
router.use('/trackings',verifyToken,tracking);
router.use('/pickndrop',verifyToken,pickndrop);
// router.use('/payment',verifyToken,payment);
router.use('/payment',payment);
router.use('/statencity',verifyToken,statencity);
router.use('/bank',verifyToken,bank);


// Provider APP
router.use('/vendor',verifyToken,vendor);

module.exports = router;

