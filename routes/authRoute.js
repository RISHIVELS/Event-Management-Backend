const express = require("express");
const router = express.Router();
const { authenticateUser } = require("./../middlewares/authentication.js");

const {
  loginUser,
  registerUser,
  logoutUser,
  verifyCode,
} = require("./../controllers/authController.js");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(authenticateUser, logoutUser);
router.route("/verify-code").post(verifyCode);

module.exports = router;
