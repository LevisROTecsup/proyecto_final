const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  is_admin: {
    type: Boolean,
    default: false
  }
})

userSchema.statics.hashPassword = async (incomingPassword) => {
  return await bcrypt.hashSync(incomingPassword);
}

userSchema.statics.checkPassword = async (incomingPassword, currentPassword) => {
  return await bcrypt.compareSync(incomingPassword, currentPassword);
}

module.exports = mongoose.model("User", userSchema);