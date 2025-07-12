const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 5,
  },
  role: {
    type: String,
    enum: ["user", "organizer"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  code: {
    type: String,
  },
  verifyDate: {
    type: Date,
  },

  refreshToken: {
    type: String,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
});

userSchema.methods.createToken = function (payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" });
  return token;
};

userSchema.methods.comparePassword = async function (userPassword) {
  const isPasswordCorrect = await bcrypt.compare(userPassword, this.password);
  return isPasswordCorrect;
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
