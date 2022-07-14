const mongoose = require("mongoose");
const moment = require("moment");

const OfferSchema = new mongoose.Schema(
  {
    service_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"service"
    },
    promo_code: 
    {
      type:String,
      unique:true
    },
    start_date: Date,
    end_date: Date,
    // noofuses: String,
    discount: Number,
    minorderamt: String,
    // repeat_usage: String,
    Created_on: 
    {
      type: Date,
      default: Date.now,
    },

  })

module.exports = mongoose.model("offer", OfferSchema)