const { userAuth } = require("../middlewares/auth");
const express = require("express");

const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

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
    }).populate("fromUserId", "firstName lastName about skills gender photoUrl").populate("toUserId", "firstName lastName about skills gender photoUrl");
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;

      } else {
        return row.fromUserId;
      }
    });
    res.send({
      message: "Data sent successfully",
      data: data
    });

  } catch (error) {
    res.status(400).send("Something went wrong" + error);

  }
});


userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    //show all the users who has not sent request to loggedin user or vice versa
    // should not see loggedin user 
    // get all the users except logged in user

    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    //find all connection req, sent or received

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
    }).select("fromUserId toUserId")
    //its like an array it will store only unque value
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({

      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, {
          _id:
          {
            $ne: loggedInUser._id
          }
        }

      ],

    }).select("firstName lastName about skills gender photoUrl").skip(skip).limit(limit);

    res.send({ message: "display feed success", data: users });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong" + error });
  }

});


module.exports = userRouter;