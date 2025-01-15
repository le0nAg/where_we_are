const mongoose = require("mongoose");
const argon2 = require('argon2');

const operatorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

operatorSchema.pre("save", async function () {
  this.password = await argon2.hash(this.password, 12);
});

module.exports = mongoose.model("Operator", operatorSchema);
