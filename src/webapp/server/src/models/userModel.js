const mongoose = require("mongoose");
const argon2 = require('argon2');

const UserSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    firstName: String,
    lastName: String,
    email: String,
    profilePicture: String
});
  
const User = mongoose.model('User', UserSchema);