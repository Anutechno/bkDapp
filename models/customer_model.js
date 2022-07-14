const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    first_name:{
        type:String,
    },
    last_name:{
        type:String,
    },
    email: {
        type: String,
        //required: [true, "Please enter an email"],
        //unique: [true, "Email already exists"],
    },
    password: {
        type: String,
        //required: [true, "Please enter a password"],
        // minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    phone:{
        type:Number,
        //required: [true, "Please enter a mobile no"],
        //minlength: [10, "Mobile no must be at least 10 digits"],
    },
    state:{
        type:String,
    },
    city:{
        type:String,
    },
    address:{
        type:String,
    },
    pincode:{
        type:Number,
    },
    image: {
        type: String,
    },
    status: {
        type: Number,
        default: 0, // 0 = inactive , 1 = active
    },
    wallet_money:{
      type:Number,
      default:"",
    },
    Created_on: {
        type: Date,
        default: Date.now,
    },
    otp:{
        type : Number,
        default:"",
    },
    // user_type:{
    //     type:Number,
    //     default:4,
    // },
    // tnc:{
    //     type:Boolean,
    //     required: [true, "Please select Term n Conditions"],
    // },
    // bio:{
    //     type: String,
    // },
    // gender:{
    //     type:String,
    //     enum :["MALE","FEMALE","OTHER"],
    // },
    // age:{
    //     type: Number,
    // },
    // language :{
    //     type:[String],
    // },
    // profession:{
    //     type:String,
    // },
    // services:{
    //     type:[String],
    // },
    
    // img: { 
    //     data: Buffer, 
    //     contentType: String 
    // }, 
},
{
    timestamps:true
}
)

module.exports = mongoose.model("customers",CustomerSchema);