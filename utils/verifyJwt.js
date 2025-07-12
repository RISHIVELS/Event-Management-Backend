const jwt = require("jsonwebtoken");
const CustomError = require("../error/customError");
const { StatusCodes: code } = require("http-status-codes");

const verifyJwt = (token) => {
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    return verify;
  } catch (err) {
    throw new CustomError("Invalid credential", code.UNAUTHORIZED);
  }
};

module.exports = verifyJwt;
