var pickndrop = require("../models/PickupnDrop");
var login = require("../models/login_model")
const customers = require("../models/customer_model");
const jwt_decode = require("jwt-decode");
const otpAuth = require("../helper/otpAuth");


async function PicknDrop(req,res){
    try{
      const data = jwt_decode(req.headers.token);
      const user_ids = data.user_id;
      const user_type = data.user_type;
      const type = data.type;
        if (user_ids == null || user_type != 1 && user_type != 4 ) {
          var response = {
            status: 401,
            message: "admin is un-authorised !",
          };
          return res.status(401).send(response);
        }

        const {service_provider_id, user_id,service_provider_address, user_address} = req.body;

        let service_provider = await login.findOne({user_id:service_provider_id});
        
        if(!service_provider){
            res.status(401).json({ error: "No service_provider Found" })
            return;
        }

        let user = await customers.findById(user_id);

        if(!user){
            res.status(401).json({ error: "No User Found" })
            return;
        }

        // user n provider mobile no
        const sphone = service_provider.phone
        const uphone = user.phone
        const datas = {
            service_provider_id:service_provider_id,
            user_id : user_id,
            service_provider_address: service_provider_address,
            user_address: user_address
          };

        const pickndropresponce = await pickndrop.create(datas);

        if (pickndropresponce) {

            const data = await otpAuth.pickndropotp(sphone,uphone,service_provider_address,user_address)
            // console.log(data);
            pickndropresponce.otp = data.otp
            var response = {
              status: 200,
              message: "Pickndrop added successfully",
              data: pickndropresponce,
              image_base_url: process.env.BASE_URL,
            };
            return res.status(200).send(response);
          } else {
            var response = {
              status: 201,
              message: "Unable to add Pickndrop",
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


module.exports = { PicknDrop }