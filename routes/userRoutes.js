const { Router} = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {userModel, courseModel,purchaseModel} = require("../db"); 
const {JWT_USER_SECRET} = require("../config");
const {userMiddleware} = require("../middlewares/userMiddleware");
const {isValidEntry} = require("../isValid");

const userRouter = Router();

userRouter.post("/signup",isValidEntry,async (req,res)=>{
    const {email,password} = req.body;
    try{
        await userModel.create({
            email,
            password : await bcrypt.hash(password,5)
        });
        res.json({
            message : "User signed up successfully"
        });
    }catch(err){
        if(err.code===11000){
            return res.json({
                message : "Email already exists"
            }); 
        }
        res.json({
            message : "Error occurred"
        });
    }
});
userRouter.post("/signin",isValidEntry,async (req,res)=>{
    const {email,password} = req.body;
    try{
        const foundUser = await userModel.findOne({email});
        if(!foundUser){
            return res.json({
                message : "Email not found"
            });
    }else{
        const hashPass = await bcrypt.compare(password,foundUser.password);
        if(hashPass){
            res.setHeader("token",jwt.sign({
                id : foundUser._id
            },JWT_USER_SECRET));
            return res.json({
                message : "Valid credentials",
            })
        }
        res.json({
            message : "Password not matching"
        });
    }
    }catch(err){
        res.json({
            message : "Error occurred while user signin"
        });
    }
});
userRouter.get("/purchases",userMiddleware,async (req,res)=>{
    const userId = req.userId;
    const courses = await purchaseModel.find({userId});
    const purchasesCourses = [];
    for(let i=0;i<courses.length;i++){
        purchasesCourses.push(courses[i].courseId);
    }
    const courseData = await courseModel.find({
        _id : {$in: purchasesCourses}
    })
    res.json({
        courses,
        courseData
    });
});
module.exports = {
    userRouter
}


