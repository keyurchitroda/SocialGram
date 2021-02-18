const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User")
const bcrypt = require("bcryptjs"); // encrypt passsword
const crypto = require("crypto");  // we need to generate unique token so this module used in forgot password
const jwt = require("jsonwebtoken");
const {JWT_SECRETKEY} = require("../keys")
const requireLogin = require("../middleware/requireLogin")
//send mail for forgot password
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const e = require("express");

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"SG.yzV-hUSMSFyWDLhGqyIJLg.uatXtuFUTtHs18tWInhgjkbLy16GPSH8KgG0MgG62fg"
    }
}))


// Signup

router.post("/signup", (req, res) => {
    const { name, email, password, confirmpassword, DOB, pic } = req.body
    if (!name || !email || !password || !confirmpassword || !DOB) {
        return res.status(422).json({ error: "please add all the fields..!" })
    }
      
        User.findOne({ email: email })
            .then((savedUser) => {
                if (savedUser) {
                    return res.status(422).json({ error: "user already exist with that email..!" })
                }
                else if (password !== confirmpassword) {
                    return res.status(422).json({ error: "password not matched with confirmpassword..!" })
                }

                else {
                    bcrypt.hash(password, 12)
                        .then(hashedpassword => {

                            const user = new User({
                                name,
                                email,
                                password: hashedpassword,
                                confirmpassword:hashedpassword,
                                DOB,
                                pic
                            })

                            user.save()
                                .then((user) => {
                                    transporter.sendMail({
                                        to:user.email,
                                        from:"keyurchitroda@gmail.com",
                                        subject:"Signup Successfull..!",
                                        html:"<h1>!...Welcome To SocialGram...!:)</h1>"
                                    }).catch(err=>{
                                        console.log(err);
                                    })
                                    res.json({ message: "saved successfully" })
                                })
                                .catch((err) => {
                                    console.log(err);
                                })

                        })
                }
            })
            .catch(err => {
                console.log(err);
            })
    
})

//Signin

router.post("/signin",(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please add email or password...!"})
    }

    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password...!"})
        }

        bcrypt.compare(password,savedUser.password)
        .then((doMatch)=>{
            if(doMatch){
               // res.json({message:"Successfully signed in"})

               //generate the token after successfully signed in
               const token = jwt.sign({_id:savedUser._id},JWT_SECRETKEY)
               const {_id,name,email,followers,following,pic} = savedUser // with generating token we provide user information
               res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid email or password...!"})
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })

})

//forgot password
router.post("/forgot-password",(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
        }
       const token = buffer.toString("hex") //buffer convert hexadecimal type
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"user don't exists with that email..!"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000 // expired one hour
            user.save().then(result=>{
                transporter.sendMail({
                    to:user.email,
                    from:"keyurchitroda@gmail.com",
                    subject:"Forgot Password..!",
                    html:`<p>you requested for password forgot</p>
                          <h5>click in this <a href="http://localhost:3000/forgot/${token}">link</a> to forgot password</h5></h5>`
                })
                res.json({message:"Check Your Email..!"})
            })
        })
    })
})

router.post("/new-password",(req,res)=>{
    const newpassword = req.body.password
    const newconfirmpassword = req.body.confirmpassword

    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired..!"})
        }
        else if (newpassword !== newconfirmpassword) {
            return res.status(422).json({ error: "password not matched with confirmpassword..!" })
        }
        else{
            bcrypt.hash(newpassword, 12) .then(hashedpassword => {

                user.password = hashedpassword
                user.confirmpassword = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined

                user.save().then((saveduser)=>{
                    res.json({message:"Password update succesfully...!"})

                })
            })    
        }
    }).catch(err=>{
        console.log(err);
    })
})

module.exports = router;



