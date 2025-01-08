const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error('enter valid email id');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('enter strong password');
  }

}

module.exports = {
  validateSignUpData
};