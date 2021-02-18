const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const chatSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    recieved: Boolean,
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
})
module.exports=mongoose.model("messagecontents",chatSchema)