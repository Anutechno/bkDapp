
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema (
    {
        cf_order_id:{
            type:String,
        },
        orderId:{
            type:String,
            // type:mongoose.Schema.Types.ObjectId,
            // ref:"Booking"
        },
        booking_id:{
            type:String,
            // type:mongoose.Schema.Types.ObjectId,
            // ref:"Booking"
        },
        service_provider_id:{
            type:String,
        },
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"customers"
        },
        orderAmount:{
            type:Number,
        },
        payment_type:{
            type:String,
        },
        order_currency:{
            type:String,
            default:"INR"
        },
        order_status:{
            type:String,
        },
        order_token:{
            type:String,
        },                 
        create_date: {
            type: Date,
            default: Date.now
        },
},
{
    timestamps:true,
}
);


module.exports = mongoose.model("Payment", paymentSchema );