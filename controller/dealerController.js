var validation = require('../helper/validation');
var helper = require('../helper/helper');

require('dotenv').config();
var moment = require('moment');
const login = require('../models/login_model');
const dealer = require('../models/dealerModel');
const { delay } = require('lodash');
const jwt_decode = require("jwt-decode");


async function addDealer(req, res) { // created by  store or vendor
    try {
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        const type = data.type;
        if (user_id == null || user_type != 1) {
            var response = {
                status: 401,
                message: 'admin is un-authorised !'
            };
            return res.status(401).send(response);
        }
        const {first_name,last_name, email, password, phone, address, latitude, longitude, state, city,pincode  } = req.body;

        if (email != '' && password != '') {
            
            var emailCheck = await login.findOne({ email: email });
            if (!emailCheck) {

                const data = {
                    first_name:first_name,
                    last_name:last_name,
                    email: email,
                    phone: phone,
                    password: validation.hashPassword(password),
                    state:state,
                    city:city,
                    address: address,
                    pincode:pincode,
                    latitude: latitude, 
                    longitude: longitude,
                    create_by: user_id    
                };
                const dealerResposnse = await dealer.create(data);

                if (dealerResposnse) {
                    const loginData = {
                        user_id: dealerResposnse._id,
                        name:first_name,
                        email: email,
                        phone: phone,
                        password: validation.hashPassword(password),
                        state:state,
                        city:city,
                        address: address,
                        pincode:pincode,
                        latitude: latitude, 
                        longitude: longitude,
                        user_type: 3,
                        create_by: user_id,
                    };
                    const logindealerdata = await login.create(loginData);

                    var response = {
                        status: 200,
                        message: 'Registration success',
                        data: dealerResposnse,
                    };
                    return res.status(200).send(response);
                } else {
                    var response = {
                        status: 201,
                        message: 'Registration failed',

                    };
                    return res.status(201).send(response);
                }
            } else {
                var response = {
                    status: 201,
                    message: 'Email already exist',
                };
                return res.status(201).send(response);
            }
        } else {
            var response = {
                status: 201,
                message: 'email and password not be empty value !',
            };
            return res.status(201).send(response);
        }
    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
};


async function editDealer(req, res) { // created by  store or vendor

    try {
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 3 ) {
            var response = {
                status: 401,
                message: 'admin is un-authorised !'
            };
            return res.status(401).send(response);
        }
        const {dealer_id, first_name,last_name, address, latitude, longitude, phone ,state,city,pincode } = req.body;

        const datas = {
            first_name: first_name,
            last_name: last_name,
            phone: phone,
            state: state,
            city: city,
            address: address,
            pincode: pincode,
            latitude: latitude, 
            longitude: longitude,
        };
        var where = { _id: dealer_id };
        dealer.findByIdAndUpdate(where,
            { $set: datas },
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
                    var response = {
                        status: 200,
                        message: 'dealer updated successfully',
                        data: docs,
                       // _url: process.env.BASE_URL + '/employee',
                    };
                    return res.status(200).send(response);
                }
            });
    
    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
};


async function dealerList(req, res) {
    try {

        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 4 ) {
            var response = {
                status: 401,
                message: 'admin is un-authorised !'
            };
            return res.status(401).send(response);
        }
        var dealerResposnse = await dealer.find().sort( { "_id": -1 } );

        if(dealerResposnse.length > 0){
            var response = {
                status: 200,
                message: 'success',
                data: dealerResposnse,
            };
            return res.status(200).send(response);
        }else{
            var response = {
                status: 201,
                message: 'failed',
                data: [],
            };
            return res.status(201).send(response);
        }     
    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
}; 


async function singledealer(req, res) {
    try {
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        const type = data.type;
        if (user_id == null || user_type != 1 && user_type != 3 ) {
            var response = {
                status: 401,
                message: 'admin is un-authorised !'
            };
            return res.status(401).send(response);
        }
        //var dealerResposnse = await dealer.find().sort( { "_id": -1 } );
        var dealerResposnse = await dealer.findById(req.params.id)
        if(dealerResposnse){
            var response = {
                status: 200,
                message: 'success',
                data: dealerResposnse,
            };
            return res.status(200).send(response);
        }else{
            var response = {
                status: 201,
                message: 'No Dealer Found',
                data: [],
            };
            return res.status(201).send(response);
        }     
    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
}; 


async function deleteDealer(req, res) {
    try {
        const data = jwt_decode(req.headers.token);
        const user_id = data.user_id;
        const user_type = data.user_type;
        const type = data.type;
        if (user_id == null || user_type != 1 ) {
            var response = {
                status: 401,
                message: 'Admin is un-authorised !'
            };
            return res.status(401).send(response);
        }
        const { dealer_id } = req.body;
        const dealerRes = await login.findOne({user_id: dealer_id });
        if (dealerRes) {
            dealer.findByIdAndDelete({ _id: dealer_id },
                async function (err, docs) {
                    if (err) {
                        var response = {
                            status: 201,
                            message: 'Dealer delete failed'
                        };
                        return res.status(201).send(response);
                    }
                    else {
                        const result   = await login.deleteOne({ user_id: dealer_id });
                        var response = {
                            status: 200,
                            message: 'Dealer deleted successfully',
                        };
                        return res.status(200).send(response);
                    }
                });
        } else {
            var response = {
                status: 201,
                message: 'Dealer not Available',
            };
            return res.status(201).send(response);
        }
    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
};

module.exports = {
    addDealer,
    editDealer,
    dealerList,
    deleteDealer,
    singledealer
}