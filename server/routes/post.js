const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

//view All post
router.get("/allpost",requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic")  // we can get only id ..but we want all details of that id ..so we can use populate to expand the details which we want
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(posts=>{
        res.json({posts})
    })
})

//my following post
router.get("/myfollowingposts",requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name pic")  // we can get only id ..but we want all details of that id ..so we can use populate to expand the details which we want
    .populate("comments.postedBy","_id name pic")
    .sort("-createdAt")
    .then(posts=>{
        res.json({posts})
    })
})


//create Post
router.post("/createpost",requireLogin,(req,res)=>{
    const {title,body,photo} = req.body

    if(!title || !body || !photo){
        res.status(422).json({error:"please add all the fields..!"})
    }

    req.user.password = undefined // we can't show the password in user details
    req.user.confirmpassword = undefined // we can't show the password in user details

    const post = new Post({
        title,
        body,
        photo,
        postedBy:req.user
    })

    post.save().then((result)=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })

});


//view all post for signed in user in profile
router.get("/mypost",requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(myposts=>{
        res.json({myposts})
    })
    .catch(err=>{
        console.log(err);
    })
})



//like
router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}  // only loggoed in user is like
    },{
        new:true  // mongodb send updated result
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})


//unlike
router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}  // only loggoed in user is like
    },{
        new:true  // mongodb send updated result
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})


//comments
router.put("/comment",requireLogin,(req,res)=>{
 
    const comment = {text:req.body.text,postedBy:req.user._id}

    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}  // only loggoed in user is commented
    },{
        new:true  // mongodb send updated result
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})


//Delete Post
router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})   
        }

        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err);
            })
        }

    })
})





module.exports = router