const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    DOB:{
        type:Date,
        required:true,
      
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/keyur/image/upload/v1612441125/noimage_f5molp.png"
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }],
    resetToken:String,
    expireToken:Date
});

mongoose.model("User",userSchema);
// we can not export use because sometime we get error so prevent from that error to using this approach