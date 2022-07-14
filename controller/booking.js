var booking  = require("../models/Booking");
const additionaloptions = require("../models/additionalOptionsModel");
const service = require("../models/service_model");
const ApiFeatures = require("../utils/apifeatures");
var Tracking = require("../models/Tracking");
var login = require("../models/login_model")
const jwt_decode = require("jwt-decode");
const otpAuth = require("../helper/otpAuth");
const customers = require("../models/customer_model");


async function addbooking(req, res) {

  try{

      const data = jwt_decode(req.headers.token);
      const user_id = data.user_id;
      const user_type = data.user_type;
      const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 4) {
          var response = {
            status: 401,
            message: "admin is un-authorised !",
          };
          return res.status(401).send(response);
        }


        let services = await service.findById(req.params.id)
        if(!services){
            res.status(201).json({ error: "No Service exists" })
            return;
        }
        const { bullet_points, additonal_options, model, 
               brand, address, description, payment_type } = req.body;

        if(additonal_options){
        let extra_charges = 0;
        let count = 0;
        let size = additonal_options.length
        
        if(size > 0)
        {
          await additonal_options.forEach(data=>{
            additionaloptions.find({name:data},async (err,datas)=>{
              extra_charges += datas[0].cost
              count++
              //console.log(extra_charges);
            if(count == size){
             const data = {
             service_id:services._id,
             bullet_points:bullet_points,
             additonal_options:additonal_options,
             model:model,
             brand:brand,
             address:address,
             payment_type:payment_type,
             description:description,
             estimated_cost:services.estimated_cost + extra_charges + services.tax,
             created_by : user_id,
        };

        const bookingresponce = await booking.create(data);

        if (bookingresponce) {

          // Add booking for tracking
            const datas ={
              service_id:services._id,
              booking_id:bookingresponce._id,
              user_id : user_id,
            }
            await Tracking.create(datas)

             var response = {
               status: 200,
               message: "User Booking successfull",
               data: bookingresponce,
               image_base_url: process.env.BASE_URL,
             };
             return res.status(200).send(response);
           } else {
             var response = {
               status: 201,
               message: "Unable to add Booking",
             };
             return res.status(201).send(response);
           }
          }
            })
          })
        } else {
          const data = {
           service_id:services._id,
           bullet_points:bullet_points,
           additonal_options:additonal_options,
           model:model,
           brand:brand,
           address:address,
           description:description,
           payment_type:payment_type,
           estimated_cost:services.estimated_cost + services.tax,
           created_by : user_id,
      };
      const bookingresponce = await booking.create(data);
      if (bookingresponce) {

        // Add booking for tracking
        const datas ={
          service_id:services._id,
          booking_id:bookingresponce._id,
          user_id : user_id,
        }
        await Tracking.create(datas)

           var response = {
             status: 200,
             message: "User Booking successfull",
             data: bookingresponce,
             image_base_url: process.env.BASE_URL,
           };
           return res.status(200).send(response);
         } else {
           var response = {
             status: 201,
             message: "Unable to add Booking",
           };
           return res.status(201).send(response);
         }
      }
        }
        else{
            const data = {
             service_id:services._id,
             bullet_points:bullet_points,
             //additonal_options:additonal_options,
             model:model,
             brand:brand,
             address:address,
             description:description,
             payment_type:payment_type,
             estimated_cost:services.estimated_cost + services.tax,
             created_by : user_id,
           };
        const bookingresponce = await booking.create(data);
        if (bookingresponce) {

          // Add booking for tracking
          const datas ={
            service_id:services._id,
            booking_id:bookingresponce._id,
            user_id : user_id,
          }
          await Tracking.create(datas)
          
             var response = {
               status: 200,
               message: "User Booking successfull",
               data: bookingresponce,
               image_base_url: process.env.BASE_URL,
             };
             return res.status(200).send(response);
           } else {
             var response = {
               status: 201,
               message: "Unable to add Booking",
             };
             return res.status(201).send(response);
           }
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


async function getallbookings(req, res) {
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
      
        // const apiFeature = new ApiFeatures(booking.find(), req.query)
        // .search()
        // .filter();
        
        // let bookingresponce = await apiFeature.query;
        // // console.log(log);
        // bookingresponce = await apiFeature.query.clone();

        const bookingresponce = await booking.find(req.query).populate({path:"service_id",select: ['name', 'image', 'description']})
                                                             .populate({path:"created_by",select: ['first_name', 'last_name', 'phone','image','address','city']})

        if (bookingresponce) {
            var response = {
              status: 200,
              message: "successfull",
              data: bookingresponce,
              image_base_url: process.env.BASE_URL,
            };
            return res.status(200).send(response);
          } else {
            var response = {
              status: 201,
              bookingresponce,
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


async function getbooking(req, res) {
  try{
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 2 && user_type != 3 && user_type != 4) {
          var response = {
            status: 401,
            message: "admin is un-authorised !",
          };
          return res.status(401).send(response);
        }
      
        let bookingresponce = await booking.findOne({_id:req.params.id})
                                           .populate({path:"service_id",select: ['name', 'image', 'description']})
                                           .populate({path:"created_by",select: ['first_name', 'last_name', 'phone','image','address','city']})
                                           // .populate({path:"service_provider_id",select: ['name', 'email', 'phone']})

        if (bookingresponce) {
            var response = {
              status: 200,
              message: "successfull",
              data: bookingresponce,
              image_base_url: process.env.BASE_URL,
            };
            return res.status(200).send(response);
          } else {
            var response = {
              status: 201,
              data:[],
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


async function getuserbookings(req, res) {
  try{
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 4) {
          var response = {
            status: 401,
            message: "admin is un-authorised !",
          };
          return res.status(401).send(response);
        }
      
        let bookingresponce = await booking.find({created_by:req.params.id}).populate({path:"service_id",select: ['name', 'image', 'description']}).populate({path:"created_by",select: ['first_name', 'last_name', 'phone','address','city']})

        if (bookingresponce) {
            var response = {
              status: 200,
              message: "successfull",
              data: bookingresponce,
              image_base_url: process.env.BASE_URL,
            };
            return res.status(200).send(response);
          } else {
            var response = {
              status: 201,
              data:[],
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


async function deletebooking(req, res) {
  try {

    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1) {
      var response = {
        status: 401,
        message: "Admin is un-authorised !",
      };
      return res.status(401).send(response);
    }


    const { booking_id } = req.body;
    const bookingRes = await booking.findOne({ _id: booking_id });
    if (bookingRes) {
      booking.findByIdAndDelete({ _id: booking_id }, async function (err, docs) {
        if (err) {
          var response = {
            status: 201,
            message: "Booking delete failed",
          };
          return res.status(201).send(response);
        } else {
          var response = {
            status: 200,
            message: "Booking deleted successfully",
          };
          return res.status(200).send(response);
        }
      });
    } else {
      var response = {
        status: 201,
        message: "Booking not Found",
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


async function updatebooking(req, res){
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1 && user_type != 2 && user_type != 3 && user_type != 4) {
      var response = {
        status: 401,
        message: "Admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const { status, service_provider_id,service_provider_address} = req.body;

    

    let bookings = await booking.findById(req.params.id);
    if(!bookings){
        res.status(201).json({status: 201, error: "No Booking Found" })
        return;
    }

    let user = await customers.findById({_id:bookings.created_by});
    if(!user){
        res.status(201).json({status: 201, error: "No User Found" })
        return;
    }

    let vendors = await login.findOne({user_id:service_provider_id});
    if(!vendors){
        res.status(201).json({status: 201, error: "No Service Provider Found" })
        return;
    }

    if (bookings && vendors) {
      const data = {
        status: status,
        service_provider_id: service_provider_id,
        service_provider_address:service_provider_address
      };
      booking.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: data },
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: err,
            };
            return res.status(201).send(response);
          } 
          else {

            const sphone = vendors.phone
            const uphone = user.phone
            const service_provider_address = docs.service_provider_address
            const user_address = user.address
            
            const data = await otpAuth.pickndropotp(sphone,uphone,service_provider_address,user_address)
            docs.otp = data.otp
            
            var response = {
              status: 200,
              message: "Booking updated successfully",
              data: docs,
              image_base_url: process.env.BASE_URL,
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      response = {
        status: 201,
        message: "Booking not Found",
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
    addbooking,
    getallbookings,
    getbooking,
    deletebooking,
    getuserbookings,
    updatebooking
}