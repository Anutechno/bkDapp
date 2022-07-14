const mongoose = require("mongoose");
const LoginSchema = new mongoose.Schema({
    name: String,
    user_id: String,
    email: String,
    phone: String,
    password: String,
    phone: Number,
    state: String,
    city: String,
    address: String,
    pincode: Number,
    latitude: String,
    longitude: String,
    create_by: String,
    user_type:{
      type:Number,
      default:0,   // 1 = admin , 2 =employee, 3 = dealer , 4 = customer ,
    },
    active:{
      type:Number,
      default:1,   // 1 = Yes , 0 = No ,
    },
    status:{
      type:Number,
      default:1,   // 0 = inactive , 1 = active
    },
    otp:{
      type:Number,
    },
    create_date: {
      type: Date,
      default: Date.now
    },
  })

module.exports = mongoose.model(
    "login", LoginSchema
   );