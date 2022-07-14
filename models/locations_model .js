const mongoose = require("mongoose");
const LocationsSchema = new mongoose.Schema({
  name: String,
  active: Number,
  create_by: String,
  latitude: String,
  longitude: String,
  Created_on: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Locations", LocationsSchema);
