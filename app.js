require("dotenv").config();
require("express-async-handler");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");

// inbuilt middleware invoke
app.use(express.static("./public"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan("tiny"));
app.use(fileUpload({ useTempFiles: true }));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
});

// protection routes
app.set("trust proxy", 1);
app.use(cors());
app.use(helmet());
app.use(
  rateLimiter({
    windowMs: 1000 * 60 * 15,
    max: 100,
    message: "Too many requests from this IP, please try again later",
  })
);

// utils and function imports
const connectDB = require("./db/connectDB.js");

// custom middlewares imports
const errorHandlerMiddleware = require("./middlewares/errorHandler.js");
const notFoundMiddleware = require("./middlewares/notFound.js");

// router imports
const authRouter = require("./routes/authRoute.js");
const eventRouter = require("./routes/eventRoute.js");
const bookingRouter = require("./routes/bookingRoute.js");

// middlewares
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/bookings", bookingRouter);

app.use("/", (req, res) => {
  res.send("Eventmanagement Backend Api");
});

// error and notfound
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// server
const PORT = process.env.PORT;

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log("server is listening on port", PORT);
  });
  console.log("database connected successfully");
};

start();
