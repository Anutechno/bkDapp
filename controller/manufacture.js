var validation = require("../helper/validation");
var helper = require("../helper/helper");

require("dotenv").config();
var moment = require("moment");
const manufacture = require("../models/manufacture_model");
const admin = require("../models/admin_model");
const jwt_decode = require("jwt-decode");


async function addmanufacture(req, res) {
  // created by  store or vendor
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

    const { name, description,model, manufacture_image } = req.body;
    if (manufacture_image) {
      const userdetail = await admin.findOne({ _id: user_id });
      const data = {
        manufacture_image: manufacture_image,
        name: name,
        model,model,
        description: description,
        user_id:user_id,
      };
      const manufactureResponse = await manufacture.create(data);
      if (manufactureResponse) {
        var response = {
          status: 200,
          message: "manufacture added successfully",
          data: manufactureResponse,
          image_base_url: process.env.BASE_URL,
        };
        return res.status(200).send(response);
      } else {
        var response = {
          status: 201,
          message: "Unable to add manufacture",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "please upload manufacture image",
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


async function manufacturelist(req, res) {
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

    var manufactureResposnse = await manufacture.find(req.query);
    // console.log("manufactureResposnse: ", manufactureResposnse);

    if (manufactureResposnse.length > 0) {
      var response = {
        status: 200,
        message: "success",
        data: manufactureResposnse,
        image_base_url: process.env.BASE_URL,
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        data: [],
        message: "No Manufactures Found",
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


async function deletemanufacture(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1 ) {
      var response = {
        status: 401,
        message: "Admin is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { manufacture_id } = req.body;
    const manufactureRes = await manufacture.findOne({ _id: manufacture_id });
    if (manufactureRes) {
      manufacture.findByIdAndDelete(
        { _id: manufacture_id },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "employee delete failed",
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "manufacture deleted successfully",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "manufacture not Available",
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


async function editmanufacture(req, res) {
  try {
    const data = jwt_decode(req.headers.token);
    const user_id = data.user_id;
    const user_type = data.user_type;
    const type = data.type;
    if (user_id == null || user_type != 1 ) {
      var response = {
        status: 401,
        message: "Admin is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { manufacture_id, name,model, description, manufacture_image } = req.body;
    const manufactureResp = await manufacture.findOne({ _id: manufacture_id });

    if (manufactureResp) {
      const data = {
        name: name,
        model:model,
        description: description,
        manufacture_image: manufacture_image,
        //update_dt: new Date,
      };
      manufacture.findByIdAndUpdate(
        { _id: manufacture_id },
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
              message: "manufacture updated successfully",
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
        message: "manufacture not available",
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
  addmanufacture,
  manufacturelist,
  deletemanufacture,
  editmanufacture,
};
