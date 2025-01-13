const express = require("express");

const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const { validateProfileEditData } = require("../utils/validation");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {

  try {

    const user = req.user;
    res.send(user);


  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }


});


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {

    if (!validateProfileEditData(req)) {
      throw new Error("invalid data");
    };

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: " your profile updated successfully",
      data: loggedInUser
    });

  } catch (error) {
    res.status(400).send("Something went wrong" + error);
  }

});


profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  //existing password  - check if correct, user already loggedin 
  //new password
  //confirm password
  const { password, new_password, confirm_password } = req.body;
  try {

    const isPasswordValid = await user.validatePassword(new_password);
    if (isPasswordValid) {
      res.send("Password valid");
    } else {
      res.send("Password Validation failed");
    }
  } catch (error) {
    res.status(400).send("Something went wrong" + error);
  }
})
module.exports = profileRouter;