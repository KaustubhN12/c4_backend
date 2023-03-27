const express = require("express");
const {connection} = require("./db");
const {userRouter} = require("./Routes/user.route");
const {postRouter} = require("./Routes/post.route");
const {auth} = require("./middleware/auth.middleware");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).send({msg:"home-page"});
})

app.use("/users",userRouter);
app.use(auth);
app.use("/posts",postRouter);

app.listen(process.env.PORT,async()=>{
    try {
        await connection;
        console.log("connected to mongoDB");
    } catch (err) {
        console.log(err);
    }
    console.log("server is running on 8080 port");
})