var validation = require('../helper/validation');
const login = require('../models/login_model');
const otpAuth = require("../helper/otpAuth");
const ApiFeatures = require("../utils/apifeatures");
const jwt_decode = require("jwt-decode");
const employee = require("../models/employee_model");
const dealer = require('../models/dealerModel');


//user_type = (2=employee, 3=dealer ) For Only
async function usersignin(req, res) {
    try{
        const {phone, password} = req.body;
        if (phone != '' && password != ''){
            let user = await login.findOne({phone:phone})
            if(user){
               if(user.user_type == 3 || user.user_type == 2){
                if (validation.comparePassword(user.password, password)){
                    const token = validation.generateUserToken(user.email, user._id, 1, user.name, 'logged', user.user_type)
                    const data = await otpAuth.otp(phone)
                    login.findByIdAndUpdate({ _id: user._id },
                    { otp: data.otp },
                    { new: true },
                    async function (err, docs) {
                        // console.log('docs:  ', docs);
                            if (err) {
                                var response = {
                                    status: 201,
                                    message: err,
                                };
                                return res.status(201).send(response);
                            }else {
                                if(docs){
                                    const userData = {
                                        user_id: docs.user_id,
                                        email:docs.email,
                                        phone:docs.phone,
                                    } 
                                    var response = {
                                        status: 200,
                                        message: 'OTP send to ur Mobile no n updated successfully',
                                        data : userData
                                    };
                                    //return res.status(200).send(response);
    
                                    res.status(200)
                                    .cookie('token', token, {
                                        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                                        sameSite: 'strict',
                                        httpOnly: true
                                    })
                                    .cookie('accessToken', data.accessToken, {
                                        expires: new Date(new Date().getTime() + 60 * 1000),
                                        sameSite: 'strict',
                                        httpOnly: true
                                    })
                                    .cookie('refreshToken', data.refreshToken, {
                                        expires: new Date(new Date().getTime() + 31557600000),
                                        sameSite: 'strict',
                                        httpOnly: true
                                    })
                                    .cookie('authSession', true, { 
                                        expires: new Date(new Date().getTime() + 30 * 1000), 
                                        sameSite: 'strict' 
                                    })
                                    .cookie('refreshTokenID', true, {
                                        expires: new Date(new Date().getTime() + 31557600000),
                                        sameSite: 'strict'
                                    })
                                    .json({
                                        success:true,
                                        user : userData,
                                        token:token,
                                        message:"User Login n OTP send to ur Mobile no"
                                    });
                                }else{
                                    var response = {
                                        status: 201,
                                        message: 'Login otp send failed!',
                                    };
                                    return res.status(201).send(response);
                                }
                            }
                    })
                } else {
                    var response = {
                        status: 201,
                        message: 'Incorrect password',
                    };
                    return res.status(201).send(response);
                }
               }else{
                    var response = {
                    status: 201,
                    message: 'Vendor not Authorized',
                };
                return res.status(201).send(response);
               }
            } else {
                var response = {
                    status: 201,
                    message: 'Vendor not exist',
                };
                return res.status(201).send(response);
            }
        } else {
            var response = {
                status: 201,
                message: 'Email and password can not be empty value!',
            };
            return res.status(201).send(response);
        }
    } catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

/*

async function sendOTP(req,res) {
    try{
    const phone = req.body.phone;
    let user = await login.findOne({phone:phone});
    if(!user){
        res.status(401).json({success:false, message:"This Mobile is not associated with any account"});
        return;
    }
    await otpAuth.otp(phone)
    .then((data) => {
        console.log(data);
        user.otp = data.otp;
        user.save();
        res.status(200)
                        .cookie('accessToken', data.accessToken, {
                            expires: new Date(new Date().getTime() + 60 * 1000),
                            sameSite: 'strict',
                            httpOnly: true
                        })
                        .cookie('refreshToken', data.refreshToken, {
                            expires: new Date(new Date().getTime() + 31557600000),
                            sameSite: 'strict',
                            httpOnly: true
                        })
                        .cookie('authSession', true, { 
                            expires: new Date(new Date().getTime() + 30 * 1000), 
                            sameSite: 'strict' 
                        })
                        .cookie('refreshTokenID', true, {
                            expires: new Date(new Date().getTime() + 31557600000),
                            sameSite: 'strict'
                        })
                        .json({success:true,msg: data.msg });
    })
    .catch(error => {
        res.status(400).json({success:false,error,message:"Not Authorized"})
        return;
    })
    } catch (error) {
        var responseErr = {
            status : 401,
            message:'Authentication Failed'
          };
          return res.status(401).send(responseErr);
    }
}

*/

async function verifyOTP(req, res) {
    try{
	const {otp,phone} = req.body

    const user = await login.findOne({phone:phone});
    if(!user){
        res.status(401).json({success:false, message:"This Mobile is not associated with any account"});
        return;
    }
        if(user.otp == otp){
            // console.log(user);
            console.log(user);
            const token = validation.generateUserToken(user.email, user._id, 1, user.name, 'logged', user.user_type)
            user.save()
            .then((data) => {
                    return res.status(200)
                    .cookie("token",token ,{
                        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                        sameSite: 'strict',
                        httpOnly: true})
                    .json({msg: 'User verified successfully',user:data , token:token});
            })
            .catch(error => {
                    // console.log('not authenticated');
                    return res.status(400).send({ verification: false, error, msg: 'Incorrect OTP' });
            })
            } else {
                    return res.status(400).send({ verification: false, msg: 'Incorrect OTP' });
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


async function logout(req, res) {
    try {
    // res.clearCookie('refreshToken')
      res
        .status(200)
        .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
        .cookie("accessToken", null, { expires: new Date(Date.now()), httpOnly: true })
        .cookie("refreshToken", null, { expires: new Date(Date.now()), httpOnly: true })
        .cookie("authSession", null, { expires: new Date(Date.now()), httpOnly: true })
        .cookie("refreshTokenID", null, { expires: new Date(Date.now()), httpOnly: true })
        .json({
          success: true,
          message: "Logged out",
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


async function getAllVendors(req,res){
    try{
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 4 ) {
          var response = {
            status: 401,
            message: "admin is un-authorised !",
          };
          return res.status(401).send(response);
        }
      
        const apiFeature = new ApiFeatures(login.find(), req.query)
        .search()
        .filter();
        
        let vendorsresponce = await apiFeature.query;
        //console.log(vendorsresponce);
        vendorsresponce = await apiFeature.query.clone();

        // let bookingresponce = await booking.find();
        

        if (vendorsresponce) {
            var response = {
              status: 200,
              message: "successfull",
              data: vendorsresponce,
              image_base_url: process.env.BASE_URL,
            };
            return res.status(200).send(response);
          } else {
            var response = {
              status: 201,
              vendorsresponce,
              message: "No Vendors Found",
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


async function updateVendor(req,res){
    try{
        const data = jwt_decode(req.headers.token);
        const user_ids = data.user_id;
        const user_type = data.user_type;
        const type = data.type;
        if (user_ids == null || user_type != 1 && user_type != 2 && user_type != 3 ) {
          var response = {
            status: 401,
            message: "admin is un-authorised !",
          };
          return res.status(401).send(response);
        }
      
        const {user_id, first_name,last_name, phone, state, city, address, pincode} = req.body;

        if(user_type == 2){
            const employeeResp = await employee.findOne({ _id: user_id });
            if (employeeResp) {
                /*  if (req.files.patient_image != undefined || req.files.patient_image != null) {
                          var patient_image = req.files.patient_image[0].filename;
                      } else
                         var patient_image = patientResp.image; */
                const data = {
                  first_name: first_name,
                  last_name: last_name,
                  phone: phone,
                  state: state,
                  city: city,
                  address:address,
                  address: address,
                  pincode: pincode,
                };
                employee.findByIdAndUpdate(
                  { _id: user_id },
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
                        const logindata = {
                            name: first_name,
                            phone: phone,
                            state: state,
                            city: city,
                            address: address,
                            pincode: pincode,
                          };
                        const venres = await login.findOne({user_id: user_id})
                        login.findByIdAndUpdate(
                            { _id: venres._id },
                            { $set: logindata },
                            { new: true },async function (err, docs) {
                                if(err){
                                    throw err
                                }
                                docs.save();
                            })
                        var response = {
                          status: 200,
                          message: "Vendor updated successfully",
                          data: docs,
                          // _url: process.env.BASE_URL + '/employee',
                        };
                        return res.status(200).send(response);
                    }
                  }
                );
              } else {
                response = {
                  status: 201,
                  message: "Vendor not available",
                };
                return res.status(201).send(response);
              }
        } else if(user_type == 3){
            const dealerResp = await dealer.findOne({ _id: user_id });
            if (dealerResp) {
                /*  if (req.files.patient_image != undefined || req.files.patient_image != null) {
                          var patient_image = req.files.patient_image[0].filename;
                      } else
                         var patient_image = patientResp.image; */
                const data = {
                  first_name: first_name,
                  last_name: last_name,
                  phone: phone,
                  state: state,
                  city: city,
                  address:address,
                  address: address,
                  pincode: pincode,
                };
                dealer.findByIdAndUpdate(
                  { _id: user_id },
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
                        const logindata = {
                            name: first_name,
                            phone: phone,
                            state: state,
                            city: city,
                            address: address,
                            pincode: pincode,
                          };
                        const venres = await login.findOne({user_id: user_id})
                        login.findByIdAndUpdate(
                            { _id: venres._id },
                            { $set: logindata },
                            { new: true },async function (err, docs) {
                                if(err){
                                    throw err
                                }
                                docs.save();
                            })
                        //logins.save();
                        var response = {
                          status: 200,
                          message: "Vendor updated successfully",
                          data: docs,
                          // _url: process.env.BASE_URL + '/employee',
                        };
                        return res.status(200).send(response);
                    }
                  }
                );
              } else {
                response = {
                  status: 201,
                  message: "Vendor not available",
                };
                return res.status(201).send(response);
              }
        }
        else{
            var response = {
                status: 401,
                message: "admin is un-authorised !",
              };
              return res.status(401).send(response);
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
    usersignin,
    verifyOTP,
    logout,
    getAllVendors,
    updateVendor,
};





