const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
    accountno: String,
    bankname: String,
    ifsc: String,
    location: String,
    accholdername:String,
    created_by: String,
  },
  {
      timestamps:true,
  })

module.exports = mongoose.model("Bank", bankSchema);


   
