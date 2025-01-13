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
        enum: {
            values: ["male", "female", "others"],
            message: '{VALUE} is incorrect'
        }
        // validate(value) {
        //     if (!["male", "female", "other"].includes(value)) {
        //         throw new Error("Gender not valid")
        //     }
        // }
    },
    photoUrl: {
        type: String,
        default: "https://dcblog.b-cdn.net/wp-content/uploads/2021/02/Full-form-of-URL-1.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo url" + value);
            }
        }
    },
    about: {
        type: String,
        default: "this isa description",
    },
    skills: {
        type: [String],
    }
}, { timestamps: true });


userSchema.indexes({ firstName: 1, lastName: -1 });
//token is created
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Deverewrcxew", { expiresIn: "7d" });
    return token;
}
//entered password & stored passwords are matched
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}


const User = mongoose.model('User', userSchema);
module.exports = User;