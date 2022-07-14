var validation = require('../helper/validation');
var helper = require('../helper/helper');
require('dotenv').config();
var moment = require('moment');
const admin = require('../models/admin_model');
var bcrypt = require('bcryptjs');


async function suadminsignup(req, res) {
    try{
        const { username, email, password} = req.body;

        let user = await admin.findOne({email});

        if(user){
            res.status(400).json({
                success:false,
                message:"User Already Exists"
            });
            return;
        }

        user = await admin({
            username,
            email,
            password,
        });

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        // now we set user password to hashed password
        user.password = await bcrypt.hash(user.password, salt);

        user.save();
        const token = validation.generateUserToken(user.email, user._id, 1, user.first_name, 'logged', 1);

        const options = {
            expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }

        res.status(201).cookie("token",token,options).json({
            success:true,
            user,
            token,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

async function suadminLogin(req, res) { //user_type = (1=admin, 2=employee, 3=dealer, 4=customer )
    try {
        
        const { email, password } = req.body;
        if (email != '' && password != '') {
            var userRes = await admin.findOne({ email: email })
            //console.log(userRes);
            if (userRes) {
                if (validation.comparePassword(userRes.password, password)) {
                    const token = validation.generateUserToken(userRes.email, userRes._id, 1, userRes.first_name, 'logged', 1)
                    
                    var response = {
                        status: 200,
                        message: 'Login Success',
                        data: userRes,
                        token: token,
                    };

                    const options = {
                        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        httpOnly: true,
                    }

                    return res.status(201).cookie("token",token,options).json({
                        success:true,
                        response
                    });
                    //return res.status(200).send(response);

                } else {
                    var response = {
                        status: 201,
                        message: 'Incorrect password',
                    };
                    return res.status(201).send(response);
                }
            } else {
                var response = {
                    status: 201,
                    message: 'Email not exist',
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
    suadminLogin,suadminsignup
};