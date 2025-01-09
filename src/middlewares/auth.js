const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {

    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token invalid")
    }
    const decodeObj = await jwt.verify(token, "Deverewrcxew");
    const { _id } = decodeObj;
    const user = await User.findById(_id);
    console.log(user);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Something went wrong!!! " + err);
  }


};

module.exports = { userAuth };