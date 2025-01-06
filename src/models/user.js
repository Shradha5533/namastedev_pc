const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required:true,
        unique :true,
        lowercase:true,
        trim:true

    },
    password: {
        type: String,
        required:true
    },
    age: {
        type: Number,
        min:18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender not valid")
            }
        }
    },
    photoUrl:{
        type:String,
        default :"default url"
    },
    about:{
        type:String,
        default:"this isa description",
    },
    skills:{
        type:[String],
    }
}, {timestamps: true});


const User = mongoose.model('User', userSchema);
module.exports = User;