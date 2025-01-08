const express = require("express");
const connectDB = require('./config/database');
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
//const { default: isEmail } = require("validator/lib/isEmail");

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
    // validate of data
    validateSignUpData(req);
    //encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    });
    try {
        await user.save();
        res.send("User data added successfuly")

    } catch (err) {

        res.status(400).send("ERROR: " + err.message);
    }

});
// Get users by email id

app.get("/user", async (req, res) => {


    const emailId = req.body.emailId;
    try {
        const users = await User.find({ emailId: emailId });
        if (users.length == 0) {
            res.status(404).send("No data found");
        } else {
            res.send("Data sent successfully");
        }
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});
//get all; users from database

app.get("/feed", async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.send(allUsers);
    } catch (error) {
        res.status(400).send("somethingwent wrong ");
    }
});
//get user by Id 
app.get("/getUserById", async (req, res) => {

    try {
        const id = req.body._id;
        if (id != '') {
            res.send("Data  found");
        } else {
            res.send("Data not found");
        }

    } catch (error) {
        res.status(400).send("Something went wrong");
    }



});


app.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try {

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            res.send("Invalid credentials")
        }
        //check if email id exists
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // create a token
            const token = await jwt.sign({ _id: user._id }, "Deverewrcxew");
            console.log(token);

            res.cookie("token", token)
            res.send("Login successfull");
        } else {
            res.send("Invalid credentials");
        }


    } catch (err) {
        res.status(400).send("Something went wrong" + err);
    }

});


app.get("/profile", async (req, res) => {
    const cookie = req.cookies;
    const { token } = cookie; ex
    const decodedMessage = await jwt.verify(token, "Deverewrcxew");
    const { _id } = decodedMessage;
    console.log("LOGGED IN USER IS:" + _id);
    res.send("readning cookie");
});

//delete a user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");

    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});
//update data of user

app.patch("/user/:userId", async (req, res) => {
    const data = req.body;
    const userid = req.params?.userId;
    try {

        const ALLOWED_UPDATES = [
            "photoUrl", " about", "gender", "age", "skills"
        ]
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Updates  not allowed");
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }
        await User.findByIdAndUpdate({ _id: userid }, data, { runValidators: true, returnDocument: "after" });
        res.send("Data updates successfully");

    } catch (error) {
        res.status(400).send("Something went wrong" + error);
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