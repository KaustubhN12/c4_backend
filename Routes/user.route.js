const express = require("express");
const userRouter = express.Router();
const {UserModel} = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city,is_married} = req.body;
    const ckeckuser = UserModel.find({email});
    if(ckeckuser.length>0){
        res.status(400).send({msg:"User already exist, please login"});
    }else{
        try {
            bcrypt.hash(password, 5,async(err, hash)=>{
                const user = new UserModel({name,email,password:hash,gender,age,city,is_married});
                await user.save();
                res.status(200).send({msg:"Registration Done !"});
            });
        } catch (err) {
            res.status(400).send({msg:"Unable to register",err:err.message});
        }
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password, user.password, (err, result)=> {
                if(result){
                    res.status(200).send({msg:"Login Successfull !",token:jwt.sign({ "userID": user._id }, 'eval')});
                }else{
                    res.status(400).send({msg:"Invalid Credential",err:err.message});
                }
            });
        }else{
            res.status(400).send({msg:"Invalid Credential",err:err.message});
        }
    } catch (err) {
        res.status(400).send({msg:"Unable to login",err:err.message});
    }
})

module.exports={
    userRouter
}