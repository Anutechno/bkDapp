const mongoose  =require("mongoose")

const featureSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    image: {
        type: String,
    },
    description:{
        type:String,
    },
    created_by: {
        type:String,
    },
    service_id:{
        type:String,
    },
    status: {
        type: Number,
        default: 1, // 0 = inactive , 1 = active
    },
},
{
    timestamps:true
})

module.exports = mongoose.model("Feature",featureSchema);