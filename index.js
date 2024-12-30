require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const {userRouter} = require("./routes/userRoutes");
const {adminRouter} = require("./routes/adminRoutes");
const {courseRouter} = require("./routes/courseRoutes")
const app = express();

app.use(express.json());

app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/course",courseRouter);

(async ()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to db successfully!!");
    app.listen(8008,()=>console.log("Server is running at port 8080"));
})();