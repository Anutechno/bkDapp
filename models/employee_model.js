
const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema ({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    phone: Number,
    state: String,
    city: String,
    address: String,
    pincode: Number,
    latitude: String,
    longitude: String, 
    create_by: String,
    otp:{
      type:String,
      default:'',
    },
    status:{
        type:Number,
        default:1,   // 0 = inactive , 1 = active
    }, 
    Created_on: {
        type: Date,
        default: Date.now
      },

})
module.exports = mongoose.model(
    "employee", employeeSchema
)