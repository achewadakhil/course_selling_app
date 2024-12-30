const mongoose = require("mongoose");
const {Schema,ObjectId} = mongoose;

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : String
});

const adminSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : String
});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
});

const purchaseSchema = new Schema({
    userId : ObjectId,
    courseId : ObjectId
})

const userModel = mongoose.model("users",userSchema);
const adminModel = mongoose.model("admin",adminSchema);
const courseModel = mongoose.model("course",courseSchema);
const purchaseModel = mongoose.model("purchases",purchaseSchema);

module.exports = {  
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}