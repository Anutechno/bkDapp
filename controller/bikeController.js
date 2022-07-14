var validation = require("../helper/validation");
var helper = require("../helper/helper");

require("dotenv").config();
var moment = require("moment");
const manufacture = require("../models/manufacture_model");
const bikeModel = require("../models/bikeModel");
// const bikemodel = require('../models/bikeModel');
const admin = require("../models/admin_model");
const jwt_decode = require("jwt-decode");


async function addBike(req, res) {
  // created by  store or vendor
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 4 && user_type != 1 ) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const { vehicle_type, name, model, registration_no, fuel_type} = req.body;

    const reg_no = await bikeModel.findOne({registration_no:registration_no});
    if(!reg_no){
        // var image = req.files.image[0].filename;
        // const userdetail = await admin.findOne({_id:user_id});
        const data = {
          vehicle_type:vehicle_type,
          // manufacture_id: manufacture_id,
          name: name,
          model:model,
          fuel_type:fuel_type,
          create_by: user_id,
          registration_no:registration_no
        };
        const bikeRes = await bikeModel.create(data);
        if (bikeRes) {
          var response = {
            status: 200,
            message: "Vehicle added successfully",
            data: bikeRes,
          };
          return res.status(200).send(response);
        } else {
          var response = {
            status: 201,
            message: "Unable to add Vehicle",
          };
          return res.status(201).send(response);
        }
     
    } else {
      return res.status(201).json({
        sucess:false,
        message: "This Registration no Vehicle Already Exist"
      });
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


async function bikeList(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1 ) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    var bikeRes = await bikeModel.find({});

    if (bikeRes.length > 0) {
      var response = {
        status: 200,
        message: "success",
        data: bikeRes,
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        data: [],
        message: "No Vehicle Found",
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


async function uservehicleList(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 4 && user_type != 1 ) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }


    var bikeRes = await bikeModel.find({create_by:user_id});

    if (bikeRes.length > 0) {
      var response = {
        status: 200,
        message: "success",
        data: bikeRes,
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        data: [],
        message: "No Vehicle Found",
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


async function deleteBike(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 4 && user_type != 1 ) {
      var response = {
        status: 401,
        message: "Admin is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { bike_id } = req.body;
    const bikeRes = await bikeModel.findOne({ _id: bike_id });
    if (bikeRes) {
      bikeModel.findByIdAndDelete({ _id: bike_id }, async function (err, docs) {
        if (err) {
          var response = {
            status: 201,
            message: "Vehicle delete failed",
          };
          return res.status(201).send(response);
        } else {
          var response = {
            status: 200,
            message: "vehicle deleted successfully",
          };
          return res.status(200).send(response);
        }
      });
    } else {
      var response = {
        status: 201,
        message: "vehicle not Found",
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


async function editBike(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 4 && user_type != 1 ) {
      var response = {
        status: 401,
        message: "Admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const { vehicle_type, name, model, registration_no, fuel_type} = req.body;

    const bike_id = req.params.id;
    const bikeResult = await bikeModel.findById(bike_id);

    if (bikeResult != null) {

      const data = {
        vehicle_type:vehicle_type,
        // manufacture_id: manufacture_id,
        name: name,
        model:model,
        fuel_type:fuel_type,
        create_by: user_id,
        registration_no:registration_no
      };
      bikeModel.findByIdAndUpdate(
        { _id: bike_id },
        { $set : data},
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: err,
            };
            return res.status(201).send(response);
          } else {
            // const bikeRes = await bikeModel.findOne({ _id: bike_id });
            var response = {
              status: 200,
              message: "Vehicle updated successfully",
              data: docs,
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      response = {
        status: 201,
        message: "Vehicle not available",
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
  addBike,
  bikeList,
  deleteBike,
  editBike,
  uservehicleList,
};
