const mongoose = require("mongoose");
const manufactureSchema = new mongoose.Schema({
    
    name: String,
    image:{
        type:String,
      },
    description: String,
    model:{
      type:String,
    },
   /*  status:{
      type:Number,
      default:1,   // 0 = inactive , 1 = active
    }, */
    Created_on: {
      type: Date,
      default: Date.now
    },
/*     update_dt: {
        type:Date,
        default: Date
    }, */

  })

module.exports = mongoose.model(
    "manufacture", manufactureSchema
   );