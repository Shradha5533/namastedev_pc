const express = require("express");
const connectDB = require('./config/database');
const app = express();
const User = require("./models/user");

app.use(express.json());
app.post("/signup", async(req, res) => {
    
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User data saved successfuly")

    } catch (error) {
        res.status(404).send("error" + error);
    }
 
});
// Get users by email id

app.get("/user", async(req, res)=>{
  
 
  const emailId = req.body.emailId;
  try{
    const users = await User.find({ emailId:emailId });
    if(users.length == 0){
      res.status(404).send("No data found");
    }else{
      res.send("Data sent successfully");
    }
  }catch(err){
    res.status(400).send("Something went wrong");
  }  
 });
 //get all; users from database

 app.get("/feed",async(req,res)=>{
    try{
        const allUsers = await User.find({});
         res.send(allUsers);
    }catch(error){
       res.status(400).send("somethingwent wrong ");
    }
 });
//get user by Id 
app.get("/getUserById",async(req,res)=>{
   
    try{
        const id = req.body._id;
        if(id!=''){
            res.send("Data  found");
        }else{
            res.send("Data not found");
        }
 
    }catch(error){
        res.status(400).send("Something went wrong");
    }

    //const user = await Adventure.findById(id).exec();

});

//delete a user
app.delete("/user", async(req,res)=>{
const userId = req.body.userId;
try {
    const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    
} catch (error) {
    res.status(400).send("Something went wrong");
}
});
//update data of user

app.patch("/user",async(req,res)=>{
    const data = req.body;
    const userid = req.body.userId;
    try{
        await User.findByIdAndUpdate({_id:userid},data,{runValidators:true,returnDocument:"after"});
        res.send("Data updates successfully");

    }catch (error) {
        res.status(400).send("Something went wrong"+error);
    }

});



connectDB().then(() => {
    console.log("database connection established");
    app.listen(7777, () => {
        console.log("Server creation success");
    });
}).catch((err) => {
    console.error("database connection failed".err);
});