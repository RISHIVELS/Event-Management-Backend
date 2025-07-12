const User = require("./../models/User.js");
const bcrypt = require("bcryptjs");
const verifyJwt = require("./verifyJwt.js");
const jwt = require("jsonwebtoken");

const attachCookie = async (res, token) => {
  const salt = await bcrypt.genSalt(10);
  const random = await bcrypt.hash("randomNumberforRefreshToken", salt);
  // const refreshToken = jwt.sign(random)
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    signed: true,
    maxAge: 1000 * 60 * 60 * 24,
  });
  res.cookie("refreshToken", random, {
    httpOnly: true,
    secure: true,
    signed: true,
    maxAge: 1000 * 60 * 60 * 24 * 15,
  });
  const payload = verifyJwt(token);
  const user = await User.findOne({ email: payload.email });
  user.refreshToken = random;
  await user.save();
};

module.exports = attachCookie;
