const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");


//send connection request 

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

  console.log("Success test");

  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status" + status
      })
    }

    // find if toUser exists

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "user doesnt exist" });
    }

    //check if the request is already been sent 
    const existingConnectionRequests = await ConnectionRequest.findOne({
      $or: [
        { toUserId: toUserId, fromUserId: fromUserId }, // Condition 1: Match email
        { toUserId: fromUserId, fromUserId: toUserId } // Condition 2: Match username
      ]

    });
    if (existingConnectionRequests) {
      res.status(400).send({ message: "Request already present" });
    }


    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });
    const data = await connectionRequest.save();
    res.json({
      message: "Connection sent successfull",
      data
    });
  } catch (error) {
    res.status(400).send("Something went wrong" + error);

  }
});



requestRouter.post("/request/receive/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid Status" + status
      });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"

    });

    if (!connectionRequest) {
      return res.status(404).send({
        message: "Connection request not found"
      });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({ message: "connection request" + status, data });
  } catch (err) {
    res.status(400).send({ message: "Something went wrong" + err });
  }

});

module.exports = requestRouter;