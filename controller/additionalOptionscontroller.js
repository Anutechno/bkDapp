var validation = require("../helper/validation");
var helper = require("../helper/helper");

require("dotenv").config();
var moment = require("moment");
const service = require("../models/service_model");
const additionaloptions = require("../models/additionalOptionsModel");
const admin = require("../models/admin_model");
const jwt_decode = require("jwt-decode");

async function addAdditionalOption(req, res) {
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

    const { name, cost, image } = req.body;

    if (image) {
      const data = {
        image: image,
        name: name,
        cost: cost,
      };

      const additionaloptionsResponse = await additionaloptions.create(data);

      if (additionaloptionsResponse) {
        var response = {
          status: 200,
          message: "Additional options added successfully",
          data: additionaloptionsResponse,
          image_base_url: process.env.BASE_URL,
        };
        return res.status(200).send(response);
      } else {
        var response = {
          status: 201,
          message: "Unable to add additional",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "please upload additional image",
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


async function updateAdditional(req, res) {
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

    const { name, cost, additional_id, image } = req.body;

    if (additional_id != "") {
      const additionaldata = await additionaloptions.findOne({
        _id: additional_id,
      });
      // console.log('additionaldata: ', additionaldata);

      if (additionaldata) {
        const data = {
          image: image,
          name: name,
          cost: cost,
        };

        additionaloptions.findByIdAndUpdate(
          { _id: additional_id },
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
                message: "additional updated successfully",
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
          message: "Unable to update additional",
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


async function additionalList(req, res) {
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
    var additionaloptionResposnse = await additionaloptions.find();

    var response = {
      status: 200,
      message: "success",
      data: additionaloptionResposnse,
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


async function deleteAdditional(req, res) {
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
    var { additional_id } = req.body;
    const additionaloptionsDel = await additionaloptions.findOne({
      _id: additional_id,
    });
    if (additionaloptionsDel) {
      additionaloptions.findByIdAndDelete(
        { _id: additional_id },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "additionaloptions delete failed",
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "additionaloptions deleted successfully",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "additonaloptions not Available",
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
  addAdditionalOption,
  additionalList,
  updateAdditional,
  deleteAdditional,
};
