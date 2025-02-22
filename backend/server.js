 const express=require("express")
 const mongoose=require("mongoose")
 require("dotenv").config();

const app=express();

app.use(express.json());


const {route}=require("./routes/authRoutes");
const router = require("./routes/resume");

app.use("/auth",route);
app.use("/resumes",router);

    mongoose.connect(process.env.MONGO_URI).then(console.log("db connect hogya bhai")).catch((err)=>console.log(err));

app.listen(process.env.PORT,()=> console.log("running on port"+process.env.PORT));

 
