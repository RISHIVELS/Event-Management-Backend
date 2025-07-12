const CustomError = require("../error/customError.js");
const verifyJwt = require("../utils/verifyJwt.js");
const { StatusCodes: code } = require("http-status-codes");
const User = require("./../models/User.js");
const bcrypt = require("bcryptjs");
const generatePayload = require("../utils/generatePayload.js");
const attachCookie = require("../utils/attachCookie.js");

const authenticateUser = async (req, res, next) => {
  const { token, refreshToken } = req.signedCookies;

  if (!token && !refreshToken) {
    throw new CustomError("Invalid Credentials", code.UNAUTHORIZED);
  }
  if (!token) {
    if (refreshToken) {
      const userRefreshToken = await User.findOne({ refreshToken });
      if (!userRefreshToken) {
        throw new CustomError("Invalid Credentials", code.UNAUTHORIZED);
      }

      const payload = generatePayload(userRefreshToken);
      const token = userRefreshToken.createToken(payload);
      await attachCookie(res, token);
      next();
    }
  } else {
    const user = verifyJwt(token);
    req.user = user;
    next();
  }
};

const authorizeUser = (...roles) => {
  return async (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      throw new CustomError("You are not allowed to access this route");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeUser };
