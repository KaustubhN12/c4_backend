const express = require("express");
const postRouter = express.Router();
const {PostModel} = require("../Model/post.model");
const jwt = require("jsonwebtoken");

postRouter.get("/",async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, 'eval');
    const query = {};
    const limit = 3;
    const {min=1,max=10,page=1} = req.query;
    query.no_of_comments = {$gte:min,$lte:max};
    query.userID = decoded.userID;
    try {
        if(decoded){
            const posts = await PostModel.find(query).skip((page-1)*limit).limit(limit);
            res.status(200).send(posts);
        }
    } catch (err) {
        res.status(400).send({msg:"unable to get data",err:err.message});
    }
})

postRouter.get("/top",async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, 'eval');
    const {page} = req.query;
    const limit=3
    try {
        if(decoded){
            const posts = await PostModel.find({userID:decoded.userID}).sort({
                no_of_comments:-1}).skip((page-1)*limit).limit(limit);
            res.status(200).send(posts);
        }
    } catch (err) {
        res.status(400).send({msg:"unable to get data",err:err.message});
    }
})



postRouter.post("/add",async(req,res)=>{
    try {
        const post = new PostModel(req.body);
        await post.save();
        res.status(200).send({msg:"a new post has been added successfully"});
    } catch (err) {
        res.status(400).send({msg:"unable to post data",err:err.message});
    }
})

postRouter.patch("/update/:postID",async(req,res)=>{
    const payload = req.body;
    const postID = req.params.postID;
    try {
        await PostModel.findByIdAndUpdate({_id:postID},payload)
        res.status(200).send({msg:"A post has been updated successfully"});
    } catch (err) {
        res.status(400).send({msg:"unable to post data",err:err.message});
    }
})

postRouter.delete("/delete/:postID",async(req,res)=>{
    const postID = req.params.postID;
    try {
        await PostModel.findByIdAndDelete({_id:postID})
        res.status(200).send({msg:"A post has been deleted successfully"});
    } catch (err) {
        res.status(400).send({msg:"unable to post data",err:err.message});
    }
})

module.exports={
    postRouter
}
// res.status(200).send({msg:"post-page"});