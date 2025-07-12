const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide an event title"],
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, "Please provide an event description"],
    maxlength: 300,
  },
  location: {
    type: String,
    required: [true, "Please provide an event location"],
  },
  date: {
    type: Date,
    required: [true, "Please provide an event date"],
  },
  category: {
    type: String,
    enum: {
      values: [
        "Technology",
        "Music",
        "Workshop",
        "Seminar",
        "Sports",
        "Entertainment",
      ],
      message: "{VALUE} is not allowed category",
    },
    default: "Technology",
  },
  seats: {
    type: Number,
    required: [true, "Please provide number of seats for an event"],
  },
  image: {
    type: String,
  },
  seatsOccupied: {
    type: Number,
    default: 0,
  },
  organizer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const EventModel = mongoose.model("Event", eventSchema);
module.exports = EventModel;
