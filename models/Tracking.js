const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
    status:{
        type:String,
        enum : ["Order Placed","Order Confirmed","Order Completed","Payment"],
        default:'Order Placed',
    },
    service_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"service"
    },
    service_provider_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"login"
    },
    booking_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking"
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
    },
},
{
    timestamps:true,
})

module.exports = mongoose.model("Tracking", trackingSchema);
