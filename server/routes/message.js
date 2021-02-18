const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Messages = require("../models/message");



router.get("/messages/sync",requireLogin,(req,res)=>{
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        }
    })
})

router.post("/messages/new",requireLogin,(req,res)=>{
    const dbMessage1 = {message:req.body.message,name:req.body.name,timestamp:req.body.timestamp,recieved:req.body.recieved,postedBy:req.user._id}

    console.log(dbMessage1);

    Messages.create(dbMessage1,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(201).json(data)
        }
    })
})

// router.put("/messages/new",requireLogin,(req,res)=>{
 
//     const message1 = {text:req.body.dbMessage,postedBy:req.user._id}

//     Messages.findByIdAndUpdate(req.body.postId,{
//         $push:{message:message1}  // only loggoed in user is commented
//     },{
//         new:true  // mongodb send updated result
//     })
//     .populate("postedBy","_id name pic")
//     //.populate("comments.postedBy","_id name")
//     .exec((err,result)=>{
//         if(err){
//             return res.status(422).json({error:err})
//         }
//         else{
//             res.json(result)
//         }
//     })
// })

module.exports= router
