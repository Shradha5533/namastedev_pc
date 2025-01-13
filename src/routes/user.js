const { userAuth } = require("../middlewares/auth");
const express = require("express");

const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", "firstName lastName about skills gender photoUrl")
    res.send({
      message: "Connection success",
      data: connectionRequests
    });
  } catch (error) {
    res.status(400).send("Something went wrong" + error);
  }
});


userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({

      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          status: "accepted",
          toUserId: loggedInUser._id,
        }
      ]
    }).populate("fromUserId", "firstName lastName about skills gender photoUrl");
    const data = connectionRequests.map((row) => row.fromUserId);
    res.send({
      message: "Data sent successfully",
      data: data
    });

  } catch (error) {
    res.status(400).send("Something went wrong" + error);

  }
});


module.exports = userRouter;