var Payment  = require("../models/Payment");
var crypto    = require('crypto');
const jwt_decode = require("jwt-decode");
var booking  = require("../models/Booking");
var Tracking = require("../models/Tracking");
const { type } = require("os");
const sdk = require('api')('@cashfreedocs-new/v2#1224ti1hl4o0uyhs');

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

async function payment(req,res){
  try{
  const {customer_id,customer_email,customer_phone,
         order_amount ,pay_type,booking_id,service_provider_id,
         upi_id,
         card_number,card_holder_name,card_expiry_month,card_expiry_year,card_cvv
        } = req.body;

        var order_id = Math.floor(1000000000000000 + Math.random() * 90000000000000).toString();
        //console.log(order_id);
         if(!pay_type) 
         {
          var response = 
          {
            status: 201,
            message: "Select payment type",
          };
          return res.status(201).send(response);
        }
        // for production
        sdk.server('https://api.cashfree.com/pg')
        sdk.CreateOrder({
          customer_details: {
            customer_id: customer_id,
            customer_email: customer_email,
            customer_phone: customer_phone
          },
          order_tags: {
            booking_id: booking_id,
            service_provider_id:service_provider_id
          },
          order_amount: order_amount,
          order_currency: 'INR',
          order_id: order_id,
        }, 
        {
          'x-client-id': process.env.APP_ID,
          'x-client-secret': process.env.SECRET_KEY,
          'x-api-version': '2022-01-01'
        })
        .then(async(data) =>{
    //console.log(data.order_token);
    //console.log(data);
      if(pay_type == "upi")
    {
    console.log("upi");
        
      // for production
      sdk.server('https://api.cashfree.com/pg');
      sdk.OrderPay({
        payment_method: {
          upi: {
            upi_id: upi_id,
            //upi_id: 'testsuccess@gocash',
            upi_expiry_minutes: 10,
            //channel: 'qrcode'
            //channel: 'link'
            channel:"collect"
          }
        },
        order_token: data.order_token
      }, {'x-api-version': '2022-01-01'})
        .then(datas =>{
          //res.json(data)

          // for Production
          sdk.server('https://api.cashfree.com/pg');
          //console.log(order_id);
          // for testing
          //sdk.server('https://sandbox.cashfree.com/pg');
          sdk.GetOrder({
            order_id: order_id,
            'x-client-id': process.env.APP_ID,
            'x-client-secret': process.env.SECRET_KEY,
            'x-api-version': '2022-01-01'
          })
            .then(async(data) => {
              
              const datass ={
                cf_order_id:data.cf_order_id,
                orderId:order_id,
                booking_id:data.order_tags.booking_id,
                service_provider_id:data.order_tags.service_provider_id,
                user_id:customer_id,
                orderAmount:order_amount,
                payment_type:pay_type,
                order_status:data.order_status,
                order_token:data.order_token,
              }
              
              await Payment.create(datass);
              res.json(datas);
            })
        })
        .catch(err => {
          var response = {
            status: 201,
            //message: "order with same id is already present",
            error:err
          };
          return res.status(201).send(response);
        });
      }
      if(pay_type == "card"){
        console.log("card");
        // for production
        sdk.server('https://api.cashfree.com/pg');
        sdk.OrderPay({
          payment_method: {
            card: {
              card_number: card_number,
              card_holder_name: card_holder_name,
              card_expiry_mm: card_expiry_month,
              card_expiry_yy: card_expiry_year,
              card_cvv: card_cvv,
              channel: 'link'
            }
          },
          order_token: data.order_token
        }, {'x-api-version': '2022-01-01'})
          .then(async(datas) =>{

                      // for Production
          sdk.server('https://api.cashfree.com/pg');

          //console.log(order_id);
          // for testing
          //sdk.server('https://sandbox.cashfree.com/pg');
          sdk.GetOrder({
            order_id: order_id,
            'x-client-id': process.env.APP_ID,
            'x-client-secret': process.env.SECRET_KEY,
            'x-api-version': '2022-01-01'
          })
            .then(async(data) => {
              
              const datass ={
                cf_order_id:data.cf_order_id,
                orderId:order_id,
                booking_id:data.order_tags.booking_id,
                service_provider_id:data.order_tags.service_provider_id,
                user_id:customer_id,
                orderAmount:order_amount,
                payment_type:pay_type,
                order_status:data.order_status,
                order_token:data.order_token,
              }
              
              await Payment.create(datass);
              res.json(datas);
            })
          })
      }
  })
  .catch(err => {
    var response = {
      status: 201,
      message: "order with same id is already present",
      error:err
    };
    return res.status(201).send(response);
  })
  
} catch (error) {
  console.log("error", error);
  response = {
    status: 201,
    message: "Operation was not successful",
  };

  return res.status(201).send(response);
}
}

async function GetPaymentOrder(req,res){
  try{
  const order_id = req.params.id;
  
  // for Production
  sdk.server('https://api.cashfree.com/pg');
  // console.log(order_id);
  // for testing
//sdk.server('https://sandbox.cashfree.com/pg');
sdk.GetOrder({
  order_id: order_id,
  'x-client-id': process.env.APP_ID,
  'x-client-secret': process.env.SECRET_KEY,
  'x-api-version': '2022-01-01'
})
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    var response = {
      status: 201,
      error:err
    };
    return res.status(201).send(response);
  });
} catch (error) {
  console.log("error", error);
  response = {
    status: 201,
    message: "Operation was not successful",
  };

  return res.status(201).send(response);
}
}

async function GetAllPayment(req,res){
  try{
  const payment = await Payment.find(req.query);
  if (payment) {
    payment.forEach((data)=>{
    // for Production
    sdk.server('https://api.cashfree.com/pg');
    //console.log(order_id);
    // for testing
    //sdk.server('https://sandbox.cashfree.com/pg');
    sdk.GetOrder({
      order_id: data.orderId,
      'x-client-id': process.env.APP_ID,
      'x-client-secret': process.env.SECRET_KEY,
      'x-api-version': '2022-01-01'
    })
      .then(async(datas) => {
        //console.log(datas.order_status);
        //console.log(data);
        if(datas.order_status == "PAID"){
          data.order_status = "PAID"
          await data.save();
          //console.log(data);
        }
      })
      .catch(err => console.error(err));
    })
    var response = {
      status: 200,
      message: "successfull",
      data: payment,
    };
    return res.status(200).send(response);
  } else {
    var response = {
      status: 201,
      data:[],
      message: "No payment Found",
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

async function Cashpayment(req,res){
  try {

      const {customer_id,customer_email,customer_phone,
      order_amount ,pay_type,booking_id,service_provider_id } = req.body;

      var order_id = Math.floor(1000000000000000 + Math.random() * 90000000000000).toString();
      
      // for production
      sdk.server('https://api.cashfree.com/pg');
      sdk.CreateOrder({
        customer_details: {
          customer_id: customer_id,
          customer_email: customer_email,
          customer_phone: customer_phone
        },
        order_tags: {
          booking_id: booking_id,
          service_provider_id:service_provider_id
        },
        order_amount: order_amount,
        order_currency: 'INR',
        order_id: order_id,
      }, 
      {
        'x-client-id': process.env.APP_ID,
        'x-client-secret': process.env.SECRET_KEY,
        'x-api-version': '2022-01-01'
      })
      .then(async(data) => {
        //console.log(data)
        const datas ={
          orderId:order_id,
          booking_id:booking_id,
          service_provider_id:service_provider_id,
          user_id:customer_id,
          orderAmount:order_amount,
          payment_type:pay_type,
          order_status:"PAID",
          order_token:data.order_token,
        }

        const payment = await Payment.create(datas)
        var response = {
          status: 200,
          message: "Cash Payment successful",
          data: payment,
        };
        return res.status(200).send(response);

      })
      .catch(err => {
        var response = {
          status: 201,
          //message: "order with same id is already present",
          error:err
        };
        return res.status(201).send(response);
      });
      
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}

async function GetPayment(req,res){
  try{

    const payment = await Payment.findById(req.params.id);

    if (payment) {
      var response = {
        status: 200,
        message: "successfull",
        data: payment,
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: "No bookings Found",
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

module.exports = {
  paymentRequest,
   paymentResponse, 
   paymentInvoices,
   payment,
   GetPaymentOrder,
   GetAllPayment,
   Cashpayment,
   GetPayment
  }