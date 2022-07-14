const mongoose = require("mongoose");
const additionalOptionsSchema = new mongoose.Schema({
    name: String,
    cost: Number,
    image:{
        type:String,
      },
    Created_on: {
      type: Date,
      default: Date.now
    },
  });

module.exports = mongoose.model(
    "additionalOptions", additionalOptionsSchema
   );