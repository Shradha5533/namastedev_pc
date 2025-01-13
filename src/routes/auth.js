const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.send("Invalid credentials")
    }
    //check if email id exists
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create a token
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) })
      res.send("Login successfull");
    } else {
      res.send("Invalid credentials");
    }


  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }

});


authRouter.post("/logout", async (req, res) => {
  // clear the token
  res.cookie("token", null, { expires: new Date(Date.now()) })
  res.send("Logout Successful");


});

module.exports = authRouter;