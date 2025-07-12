const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const nodemailerConfig = require("./nodemailerConfig.js");

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (user, event, booking) => {
  const { name: userName, email } = user;
  const { title, location, date } = event;
  const modifiedDate = new Date(date).toLocaleString();
  const data = {
    userName,
    email,
    title,
    location,
    modifiedDate,
    _id: booking._id,
  };

  const html = await ejs.renderFile(
    path.join(__dirname, "../emails", `bookingEmail.ejs`),
    data
  );

  await transporter.sendMail({
    from: `"EventmanagementVels" <eventmanagement@gmail.com>`,
    to: email,
    subject: "Booking Successfull - Details",
    html,
  });
};

module.exports = { sendEmail };
