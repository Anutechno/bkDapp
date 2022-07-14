
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema (
    {
        orderId:{
            type:String,
            // type:mongoose.Schema.Types.ObjectId,
            // ref:"Booking"
        },
        service_provider_id:{
            type:String,
            // type:mongoose.Schema.Types.ObjectId,
            // ref:"login"
        },
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"customers"
        },
        orderAmount:{
            type:Number,
        },                           
        referenceId:{
            type:String,
        },
        txStatus:{
            type:String,
        },
        paymentMode:{
            type:String,
        },
        txMsg:{
            type:String,
        },
        txTime:{
            type:String,
        },
        signature :{
            type:String,
        },
        computedsignature :{
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