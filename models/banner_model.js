const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
  deler_id: String,
  name: String,
  banner_image: {
    type: [String],
    default: [],
  },
  bannertype: Number, // 0 = flex , 1 = carousel

  /*  status:{
      type:Number,
      default:1,   // 0 = inactive , 1 = active
    }, */
  Created_on: {
    type: Date,
    default: Date.now,
  },
  /*     update_dt: {
        type:Date,
        default: Date
    }, */
});

module.exports = mongoose.model("banner", bannerSchema);
