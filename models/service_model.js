const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
  name: String,
  image: {
    type: String,
  },
  description: String,
  estimated_cost: Number,
  tax: Number,
  created_by: String,
  // additonal_options: {
  //   type: [String],
  //   default: [],
  // },
  features:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Feature"
  }],
  salient_features:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Salientfeature"
  }],
  status: {
    type: Number,
    default: 1, // 0 = inactive , 1 = active
  },
  Created_on: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("service", serviceSchema);
