const { Router} = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {adminModel , courseModel} = require("../db"); 
const {isValidEntry} = require("../isValid");
const {adminMiddleware} = require("../middlewares/adminMiddleware");

const {JWT_ADMIN_SECRET}= require("../config");
const adminRouter = Router();


adminRouter.post("/signup",isValidEntry,async (req,res)=>{
    const {email,password} = req.body;
    try{
        await adminModel.create({
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
adminRouter.post("/signin",isValidEntry,async (req,res)=>{
    const {email,password} = req.body;
    try{
        const foundAdmin = await adminModel.findOne({email});
        if(!foundAdmin){
            res.status(403).json({
                message : "Email not found"
            });
        }else{
            const hashPass = await bcrypt.compare(password,foundAdmin.password);
            if(hashPass){
                res.setHeader("token",jwt.sign({
                    id : foundAdmin._id
                },JWT_ADMIN_SECRET));
                return res.json({
                    message : "Admin signed in successfully!!"
                });
            }else{
                res.json({
                    message : "Password didnt match"
                });
            }
        }
    }catch(err){
        if(err.code===11000)
            return res.status(403).json({
                message : "Email already exists"
            });
        else{
            res.json({
                message :"Undefined error occurred"
            });
        }
    }
});
adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;
    const { title, description, imageUrl, price } = req.body;
    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id
    })
});
adminRouter.put("/course",adminMiddleware,async (req,res)=>{
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;
    const course = await courseModel.updateOne({
        _id: courseId, 
        creatorId: adminId 
    }, {
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price
    })

    res.json({
        message: "Course updated",
        courseId: course._id
    })
});
adminRouter.get("/getCourses",adminMiddleware,async (req,res)=>{
    const adminId = req.userId;
    try{
        const courses = await courseModel.find({
            creatorId : adminId
        });
        res.json({
            creatorId : adminId,
            courses : courses
        })
    }catch(err){
        res.json({
            message : "Cannot find the courses"
        });
    }
});
module.exports = {
    adminRouter
}

