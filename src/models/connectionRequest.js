const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  status: {
    type: String,
    enum: {
      values: ['ignored', 'interested', 'accepted', 'rejected'],
      message: '{VALUE} is not supported'
    },
    required: true,


  }

}, { timestamps: true });
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Compound index for efficient querying of pending requests for a specific user


// Compound index for efficient querying of sent requests by a user
//connectionRequestSchema.index({ fromUserId: 1, status: 1 });
connectionRequestSchema.pre("save", function (next) {

  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("cannot send connection request to yourself");
  }
  next();
});
const connectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = connectionRequestModel;