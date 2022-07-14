var validation = require("../helper/validation");
var helper = require("../helper/helper");
require("dotenv").config();
var moment = require("moment");
const banner = require("../models/banner_model");
const admin = require("../models/admin_model");
const jwt_decode = require("jwt-decode");


async function addbanner(req, res) {
  // created by  dealer
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

    const { name, bannertype, banner_image } = req.body;
    if (banner_image) {
      const data = {
        banner_image: banner_image,
        name: name,
        bannertype: bannertype,
        deler_id: user_id,
      };
      const bannerresponce = await banner.create(data);
      if (bannerresponce) {
        var response = {
          status: 200,
          message: "banner added successfully",
          data: bannerresponce,
          image_base_url: process.env.BASE_URL,
        };
        return res.status(200).send(response);
      } else {
        var response = {
          status: 201,
          message: "Unable to add banner",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "please upload banner image",
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


async function bannerlist(req, res) {
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
    
    var manufactureResposnse = await banner.find();
    //console.log("manufactureResposnse: ", manufactureResposnse);

    var response = {
      status: 200,
      message: "success",
      data: manufactureResposnse,
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


async function deletebanner(req, res) {
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
    const { banner_id } = req.body;
    const manufactureRes = await banner.findOne({ _id: banner_id });
    if (manufactureRes) {
    banner.findByIdAndDelete({ _id: banner_id }, async function (err, docs) {
        if (err) {
          var response = {
            status: 201,
            message: "employee delete failed",
          };
          return res.status(201).send(response);
        } else {
          var response = {
            status: 200,
            message: "banner deleted successfully",
          };
          return res.status(200).send(response);
        }
      });
    } else {
      var response = {
        status: 201,
        message: "banner not Available",
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


async function editbanner(req, res) {
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
    const { banner_id, name, bannertype, banner_image } = req.body;
    const bannerRes = await banner.findOne({ _id: banner_id });

    if (bannerRes) {
      const data = {
        name: name,
        bannertype: bannertype,
        banner_image: banner_image,
        //update_dt: new Date,
      };
      banner.findByIdAndUpdate(
        { _id: banner_id },
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
              message: "banner updated successfully",
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
        message: "banner not available",
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
  addbanner,
  bannerlist,
  deletebanner,
  editbanner,
};

