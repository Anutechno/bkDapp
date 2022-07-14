/* eslint-disable max-len */
const jwt = require('jsonwebtoken');
const login = require('../models/login_model');
const jwt_decode = require("jwt-decode");


// import env from '../../env';


/**
   * Verify Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */

function verifyToken(req, res, next){

  const { token } = req.headers;
  //const { token } = req.cookies;

  if (!token) {

    var responseErr = {
        status : 401,
        message:'Token not provided'
      };
      return res.status(401).send(responseErr);
  }
  try {
    const decoded =  jwt.verify(token, 'sk_digi');
    if (decoded) {

       if (decoded.type === 'logged') {
          req['user_id'] = decoded.user_id;
          req['email'] = decoded.email;
          req['type'] = decoded.type;   // type = 1 user type = 2 vendor
          req['name'] = decoded.name;   
          req['user_type'] = decoded.user_type; // user_type = (1=admin, 2=employee, 3=dealer, 4=customer)
         
            next();
      }else{
        
         req.user = {
            email: decoded.email,
            user_id: decoded.user_id,
            type: decoded.type,
            name: decoded.name,
          };
          next();
      }
    }
      
   
  } catch (error) {
    var responseErr = {
        status : 401,
        message:'Authentication Failed'
      };
      return res.status(401).send(responseErr);
  }
};


async function verifyUser(req, res, next){
  const token = req.cookies["token"]
  var data = jwt_decode(token);
  const user = await login.findOne({email:data.email});
  if(!user){
    return res.status(401).json({success:false, message:"Not Authorized.... Login First"})
  }
  try{
    console.log("Authorized"); 
    next();
  } catch (error) {
  var responseErr = {
      status : 401,
      message:'Authentication Failed'
    };
    return res.status(401).send(responseErr);
}
}


module.exports =   { verifyToken, verifyUser }