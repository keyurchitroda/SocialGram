const jwt = require("jsonwebtoken");
const {JWT_SECRETKEY} = require("../keys")
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:"you must be logged in"})
    }
   const token=authorization.replace("Bearer ","")   //authorization look like == Bearer ejehjkjbfjbjeftoken
 
   jwt.verify(token,JWT_SECRETKEY,(err,payload)=>{
       if(err){
        return res.status(401).json({error:"you must be logged in"})
       }

       const {_id} = payload

       User.findById(_id)
       .then(userdata=>{
           req.user = userdata  // all data availabe in req.user like username dob email password etc..
           // when we are verifying our user then we are attching all the details of that req.user
           next();
       })
       
   })
  
  
}