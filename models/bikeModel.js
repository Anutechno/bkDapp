const mongoose = require("mongoose");
const bikeSchema = new mongoose.Schema(
  {
      vehicle_type:{
        type:String,
      },
      name: {
        type:String,
      },
      model:{
        type:String,
      },
      fuel_type:{
        type:String,
      },
      registration_no:{
        type:String,
      },
      create_by:{
        type:String,
      },
      create_date: {
        type: Date,
        default: Date.now
      },
  })

module.exports = mongoose.model(
    "bike", bikeSchema
   );