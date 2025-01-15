const User = require("../models/operatorModel");
const { createSecretToken } = require("../utils/secretToken");
const argon2 = require('argon2');

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error(error);
  }
};


module.exports.Login = async (req, res, next) => {
  //console.log(req.body);
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.status(401).json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.status(401).json({message:'User not found'}) 
    }
    const auth = await argon2.verify(user.password, password)
    if (!auth) {
      return res.status(401).json({message:'Incorrect password'}) 
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
    });
    res.status(200).json({ message: "User logged in successfully", success: true });
    next()
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
    console.error(error);
  }
}
