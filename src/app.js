const express = require("express");
const connectDB = require('./config/database');
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const authProfile = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", authProfile);
app.use("/", requestRouter);
app.use("/", userRouter);








// // Get users by email id

// app.get("/user", async (req, res) => {


//     const emailId = req.body.emailId;
//     try {
//         const users = await User.find({ emailId: emailId });
//         if (users.length == 0) {
//             res.status(404).send("No data found");
//         } else {
//             res.send("Data sent successfully");
//         }
//     } catch (err) {
//         res.status(400).send("Something went wrong");
//     }
// });
// //get all; users from database

// app.get("/feed", async (req, res) => {
//     try {
//         const allUsers = await User.find({});
//         res.send(allUsers);
//     } catch (error) {
//         res.status(400).send("somethingwent wrong ");
//     }
// });
// //get user by Id 
// app.get("/getUserById", async (req, res) => {

//     try {
//         const id = req.body._id;
//         if (id != '') {
//             res.send("Data  found");
//         } else {
//             res.send("Data not found");
//         }

//     } catch (error) {
//         res.status(400).send("Something went wrong");
//     }



// });


// //delete a user
// app.delete("/user", async (req, res) => {
//     const userId = req.body.userId;
//     try {
//         const user = await User.findByIdAndDelete(userId);
//         res.send("user deleted successfully");

//     } catch (error) {
//         res.status(400).send("Something went wrong");
//     }
// });
// //update data of user

// app.patch("/user/:userId", async (req, res) => {
//     const data = req.body;
//     const userid = req.params?.userId;
//     try {

//         const ALLOWED_UPDATES = [
//             "photoUrl", " about", "gender", "age", "skills"
//         ]
//         const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
//         if (!isUpdateAllowed) {
//             throw new Error("Updates  not allowed");
//         }
//         if (data?.skills.length > 10) {
//             throw new Error("Skills cannot be more than 10");
//         }
//         await User.findByIdAndUpdate({ _id: userid }, data, { runValidators: true, returnDocument: "after" });
//         res.send("Data updates successfully");

//     } catch (error) {
//         res.status(400).send("Something went wrong" + error);
//     }

// });



connectDB().then(() => {
    console.log("database connection established");
    app.listen(7777, () => {
        console.log("Server creation success");
    });
}).catch((err) => {
    console.error("database connection failed".err);
});