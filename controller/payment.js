var Payment  = require("../models/Payment");
var crypto    = require('crypto');
const jwt_decode = require("jwt-decode");
var booking  = require("../models/Booking");
var Tracking = require("../models/Tracking");


async function paymentRequest(req, res) {
    try{
        var postData = {
            //"appId" : req.body.appId,
            "appId" : process.env.APP_ID,
            "orderId" : req.body.orderId,
            "orderAmount" : req.body.orderAmount,
            "orderCurrency" : req.body.orderCurrency,
            "orderNote" : req.body.orderNote,
            "customerName" : req.body.customerName,
            "customerEmail" : req.body.customerEmail,
            "customerPhone" : req.body.customerPhone,
            //"returnUrl" : req.body.returnUrl,
            "returnUrl" : "http://localhost:8088/mechanic/payment/paymentResponse",
            // "notifyUrl" : req.body.notifyUrl
        },
        mode = "TEST",
        //mode = "PROD",
        // secretKey = "<YOUR SECRET KEY HERE>",
        secretKey = process.env.SECRET_KEY,
        sortedkeys = Object.keys(postData),
        url="",
        signatureData = "";
        sortedkeys.sort();
        for (var i = 0; i < sortedkeys.length; i++) {
            k = sortedkeys[i];
            signatureData += k + postData[k];
        }
        // console.log(signatureData);
        var signature = crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
    
        postData['signature'] = signature;
    
        //console.log(postData);
    
        if (mode == "PROD") {
          url = "https://www.cashfree.com/checkout/post/submit";
        } else {
          url = "https://test.cashfree.com/billpay/checkout/post/submit";
        }
        
        // const options = {
        // 	method: 'POST',
        // 	url: "https://test.cashfree.com/billpay/checkout/post/submit",
        // 	headers: {'Content-Type': 'application/json'},
        // 	body: postData,
        // 	json:true
        // };
        // request(options, function (error, response, body) {
        // 	if (error) throw new Error(error);
        // 	//console.log(response);
        // 	console.log(body);
        //   });
    
        res.render('request',{postData : JSON.stringify(postData),url : url})
        
      } catch (error) {
        console.log("error", error);
        response = {
          status: 201,
          message: "Operation was not successful",
        };
        return res.status(201).send(response);
    }
}


async function paymentResponse(req, res) {
    try{

        //let bookings = await booking.findOne({_id:req.body.orderId})
        //console.log("booking",bookings);
//
        //let track = await Tracking.findOne({booking_id:req.body.orderId})
        //console.log("track",track);

        var postData = {
            "orderId" : req.body.orderId,
            //"service_provider_id": bookings.service_provider_id,
            //"user_id": bookings.created_by,
            "orderAmount" : req.body.orderAmount,
            "referenceId" : req.body.referenceId,
            "txStatus" : req.body.txStatus,
            "paymentMode" : req.body.paymentMode,
            "txMsg" : req.body.txMsg,
            "txTime" : req.body.txTime
           },
      
          //secretKey = "<YOUR SECRET KEY HERE>",
          secretKey = process.env.SECRET_KEY,
      
          signatureData = "";
          for (var key in postData) {
              signatureData +=  postData[key];
          }
      
          var computedsignature = crypto.createHmac('sha256',secretKey).update(signatureData).digest('base64');
          postData['signature'] = req.body.signature;
          postData['computedsignature'] = computedsignature;
          res.render('response',{postData : JSON.stringify(postData)});
          //console.log(postData);
          //res.send("hello");
    //       if(postData){
            
    //         const data =await Tracking.findByIdAndUpdate({_id:track._id},{status:"Payment"},{new:true})
    //         // console.log(data);
    //         const paymentres = await Payment.create(postData)
    //         // var datetime = new Date().toISOString().slice(0,10);
    //         // console.log(datetime);
    //         const response={
    //             status:200,
    //             message:"Payment Successfull",
    //             data:paymentres	
    //         }
    //         res.status(200).json(response)
    //       } else {
    //         const response = {
    //             status: 201,
    //             message: "Operation was not successful",
    //       }
    //      return res.status(201).send(response);
    // }
    } catch (error) {
        console.log("error", error);
        response = {
          status: 201,
          message: "Operation was not successful",
        };
        return res.status(201).send(response);
    }
}


async function paymentInvoices(req, res) {
  try{
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 2 && user_type != 3) {
          var response = {
            status: 401,
            message: "admin is un-authorised !",
          };
          return res.status(401).send(response);
    }

  
    const payment  = await Payment.find(req.query);

    if (payment) {
      var response = {
        status: 200,
        message: "Payment Invoice Successfull",
        data: payment,
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        featureresponce,
        message: "No Payment Invoice Found",
      };
      return res.status(201).send(response);
    }
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };
    return res.status(201).send(response);
}
}


module.exports = {paymentRequest, paymentResponse, paymentInvoices}