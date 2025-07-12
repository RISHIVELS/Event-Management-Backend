const User = require("./../models/User.js");
const CustomError = require("./../error/customError.js");
const { StatusCodes: code } = require("http-status-codes");
const attachCookie = require("./../utils/attachCookie.js");
const generatePayload = require("./../utils/generatePayload.js");
const { sendVerifyCodeEmail } = require("../utils/sendVerifyEmail.js");
const generateCode = require("../utils/generateCode.js");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create(req.body);
  res
    .status(code.CREATED)
    .json({ user: { name, email, _id: user.id, role: user.role } });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError(
      "Please provide the email and password",
      code.BAD_REQUEST
    );
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("Invalid credentials", code.UNAUTHORIZED);
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError("Invalid credentials", code.UNAUTHORIZED);
  }

  if (!user.isVerified) {
    const code = generateCode();
    user.code = code;
    user.verifyDate = Date.now();
    await user.save();

    await sendVerifyCodeEmail(user);
    res
      .status(200)
      .json({ msg: "Please check your email for the verification code" });
  } else {
    const payload = generatePayload(user);

    // generate token
    const token = user.createToken(payload);
    //attach token to cookies
    await attachCookie(res, token);

    res.status(code.OK).json({ user: payload });
  }
};

const verifyCode = async (req, res) => {
  const { code } = req.body;
  const { email } = req.query;

  const user = await User.findOne({ email, code });
  if (!user) {
    throw new CustomError("Invalid Verification code", code.UNAUTHORIZED);
  }
  const presentDate = Date.now();
  const validTime = Date.parse(user.verifyDate) + 1000 * 60 * 5;

  if (Date.parse(user.verifyDate) <= presentDate && presentDate <= validTime) {
    user.code = "";
    user.verifyDate = "";
    user.isVerified = true;
    await user.save();

    const payload = generatePayload(user);

    // generate token
    const token = user.createToken(payload);
    //attach token to cookies
    attachCookie(res, token);
    res.status(200).json({ user: payload });
  } else {
    throw new CustomError(
      "Exceeded the Code validity time. Please login again!"
    );
  }
};

const logoutUser = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    secure: true,
    signed: true,
    maxAge: 0,
  });

  res.status(code.OK).json({ msg: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser, verifyCode };
