const mongoose = require("mongoose");

const pickndropSchema = new mongoose.Schema({
    service_provider_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"login"
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
    },
    service_provider_address:{
        type:String,
    },
    user_address:{
        type:String,
    },
    otp:{
        type:Number,
    },
    status: {
        type: Number,
        default: 1, // 0 = inactive , 1 = active
    },
},
{
    timestamps:true,
})

module.exports = mongoose.model("PicknDrop", pickndropSchema);
