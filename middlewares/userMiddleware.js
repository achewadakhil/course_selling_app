const jwt = require("jsonwebtoken");

const {JWT_USER_SECRET} = require('../config');

function userMiddleware(req,res,next){
    const token = req.headers.token ;
    const decodeUser = jwt.verify(token,JWT_USER_SECRET);
    if(decodeUser){
        req.userId = decodeUser.id
        next();
    }else{
        res.status(403).json({
            message : "You are not signed in"
        });
    }
}
module.exports = {
    userMiddleware
}
