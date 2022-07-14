var Tracking = require("../models/Tracking");
var booking  = require("../models/Booking");
var login = require("../models/login_model")
var mongoose = require('mongoose'); // ES5 or below
const jwt_decode = require("jwt-decode");


async function gettracking(req, res) {
    try{
      const data = jwt_decode(req.headers.token);
      const user_id = data.user_id;
      const user_type = data.user_type;
      const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 4) 
        {
          var response = {
            status: 401,
            message: "admin is un-authorised !",
          };
          return res.status(401).send(response);
        }

        let bookings = await booking.findById(req.params.id);
        if(!bookings){
            res.status(401).json({ error: "No Booking Found" })
            return;
        }
        //console.log(bookings);
        const responses = await Tracking.findOne({booking_id:req.params.id}).populate({path:"service_id",select: ['name', 'image', 'description']}).populate({path:"user_id",select: ['first_name', 'last_name', 'phone','address','city']})
        
        if (responses) {
            var responsess = {
              status: 200,
              message: "successfull",
              data: responses,
              image_base_url: process.env.BASE_URL,
            };
            return res.status(200).send(responsess);
        } else {
            var response = {
              status: 201,
              responses,
              message: "No Booking Found",
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


async function updatetracking(req, res){
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1 && user_type != 2 && user_type != 3 ) {
      var response = {
        status: 401,
        message: "Admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const {service_provider_id, status} = req.body;

    let bookings = await booking.findById(req.params.id);
        if(!bookings){
            res.status(401).json({status: 401, error: "No Booking Found" })
            return;
    }

    const vendors = await login.findOne({user_id:service_provider_id});
    if(!vendors){
        res.status(401).json({status: 401, error: "No Service Provider Found" })
        return;
    }

    if (bookings && vendors) {
      const data = {
        status: status,
        service_provider_id: service_provider_id,
      };
      //console.log(req.params.id);
      //console.log(mongoose.Types.ObjectId(req.params.id));
      Tracking.findOne({booking_id: req.params.id },async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: err,
            };
            return res.status(201).send(response);
          } else {
            const newdata = {
              status: status,
              service_provider_id: service_provider_id,
            };
            const datas = await Tracking.findByIdAndUpdate({_id:docs._id},{$set: newdata},{new:true})
            var response = {
              status: 200,
              message: "Tracking updated successfully",
              data: datas,
              image_base_url: process.env.BASE_URL,
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      response = {
        status: 201,
        message: "Tracking not Found",
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
    gettracking,
    updatetracking,
}
