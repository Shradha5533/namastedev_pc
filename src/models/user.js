const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalidate email id");
            }
        }

    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter strong password");
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        // default :"default url",
        // validate(value){
        //     if(!validator.isURL(value)){
        //        throw new Error("Invalid photo url"+value); 
        //     }
        // }
    },
    about: {
        type: String,
        default: "this isa description",
    },
    skills: {
        type: [String],
    }
}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Deverewrcxew", { expiresIn: "7d" });
    return token;
}


userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}


const User = mongoose.model('User', userSchema);
module.exports = User;