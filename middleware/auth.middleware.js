const jwt = require("jsonwebtoken");

const auth = (req,res,next) => {
    const token = req.headers.authorization.split(" ")[1];
    if(token){
        const decoded = jwt.verify(token, 'eval');
        if(decoded){
            req.body.userID = decoded.userID;
            next();
        }else{
            res.status(400).send({msg:"you are not authorize to access this route"});
        }
    }else{
        res.status(400).send({msg:"you are not authorize to access this route"});
    }
}

module.exports={
    auth
}