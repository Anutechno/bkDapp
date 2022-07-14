var validation = require("../helper/validation");
var helper = require("../helper/helper");

require("dotenv").config();
var moment = require("moment");
const service = require("../models/service_model");
const additionaloptions = require("../models/additionalOptionsModel");
const admin = require("../models/admin_model");
const jwt_decode = require("jwt-decode");

async function addservice(req, res) {
  // created by  store or vendor
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const {
      name,
      description,
      estimated_cost,
      tax,
      additonal_options,
      image,
    } = req.body;

    if (image) {
      const data = {
        image: image,
        name: name,
        description: description,
        estimated_cost: estimated_cost,
        tax: tax,
        created_by: user_id,
        additonal_options: additonal_options,
      };

      const serviceResponse = await service.create(data);

      if (serviceResponse) {
        var response = {
          status: 200,
          message: "service added successfully",
          data: serviceResponse,
          image_base_url: process.env.BASE_URL,
        };
        return res.status(200).send(response);
      } else {
        var response = {
          status: 201,
          message: "Unable to add service",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "please upload service image",
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

async function servicelist(req, res) {
  try {
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
    var serviceResposnse = await service.find({}).populate({path:"features",select: ['name', 'image', 'description']}).populate({path:"salient_features",select: ['name', 'description']})
    // console.log("serviceResposnse: ", serviceResposnse);

    var response = {
      status: 200,
      message: "success",
      data: serviceResposnse,
      image_base_url: process.env.BASE_URL,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}

async function singleservice(req, res) {
  try {
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
    var serviceResposnse = await service.findById(req.params.id).populate({path:"features",select: ['name', 'image', 'description']}).populate({path:"salient_features",select: ['name', 'description']})
    //console.log("serviceResposnse: ", serviceResposnse);
    if(serviceResposnse){
      var response = {
          status: 200,
          message: 'success',
          data: serviceResposnse,
      };
      return res.status(200).send(response);
  }else{
      var response = {
          status: 201,
          message: 'No Service Found',
          data: [],
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

async function updateservice(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const {
      name,
      description,
      estimated_cost,
      tax,
      bullet_points,
      additonal_options,
      service_id,
      image,
    } = req.body;

    if (service_id != "") {
      // var service_image = req.files.service_image[0].filename;
      const servicedata = await service.findOne({ _id: service_id });

      if (servicedata) {
        const data = {
          image: image,
          name: name,
          description: description,
          bullet_points: bullet_points,
          estimated_cost: estimated_cost,
          tax: tax,
          created_by: user_id,
          additonal_options: additonal_options,
        };

        service.findByIdAndUpdate(
          { _id: service_id },
          { $set: data },
          { new: true },
          async function (err, docs) {
            if (err) {
              var response = {
                status: 201,
                message: err,
              };
              return res.status(201).send(response);
            } else {
              var response = {
                status: 200,
                message: "service updated successfully",
                data: docs,
                image_base_url: process.env.BASE_URL,
              };
              return res.status(200).send(response);
            }
          }
        );
      } else {
        var response = {
          status: 201,
          message: "Unable to update service",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "Can not be empty value!",
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

async function deleteService(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }
    var { service_id } = req.body;
    const serviceDel = await service.findOne({ _id: service_id });
    if (serviceDel) {
      service.findByIdAndDelete(
        { _id: service_id },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "service delete failed",
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "service deleted successfully",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "Service not Found",
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
  addservice,
  servicelist,
  updateservice,
  deleteService,
  singleservice
};
