const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const nodemailerConfig = require("./nodemailerConfig.js");

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendVerifyCodeEmail = async (user) => {
  const html = await ejs.renderFile(
    path.join(__dirname, "../emails", `verifyEmail.ejs`),
    user
  );

  await transporter.sendMail({
    from: `"EventmanagementVels" <eventmanagement@gmail.com>`,
    to: user.email,
    subject: "Verification Code - Reg",
    html,
  });
};

module.exports = { sendVerifyCodeEmail };
