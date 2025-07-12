const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model("Booking", bookingSchema);
module.exports = BookingModel;
