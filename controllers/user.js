const userModel = require("../models/user");
const constants = require("../config/constants");
const { createToken, encryptPassword, matchPassword } = require("../helpers/userControllerHelper");

const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if the role is valid
    if (!['RetailUser', 'Author', 'Admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if the email is unique
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'email already exists' });
    }

    let token = await createToken(email);
    let hashedPassword = await encryptPassword(password);
    req.body.password = hashedPassword;
    req.body["token"] = token;
    let user = await new userModel(req.body).save();
    let userInstance = { ...user._doc };
    delete userInstance.password;
    res
      .status(201)
      .send({
        statuscode: 201,
        message: constants.ACCOUNT_CREATED,
        data: userInstance,
      });
  } catch (err) {
    res.status(400).send({ statuscode: 400, message: err.message });
    console.log("signup error", err);
  }
}

// super admin login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email }).lean();
    if (!user) {
      return res
        .status(404)
        .send({ statuscode: 404, message: constants.NO_USER });
    }
    await matchPassword(password, user.password);
    let token = await createToken(user.email);
    user = await userModel
      .findOneAndUpdate({ email: user.email }, { token }, { new: true })
      .lean();
    delete user.password;
    res
      .status(200)
      .send({ statuscode: 200, message: constants.LOGIN_SUCCESS, data: user });
  } catch (err) {
    res.status(404).send({ statuscode: 404, message: err.message });
    console.log("Login error", err);
  }
};

module.exports = {
  signup,
  login
};