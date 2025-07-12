const CustomError = require("./../error/customError.js");
const { StatusCodes: code } = require("http-status-codes");
const Booking = require("./../models/Booking.js");
const Event = require("./../models/Event.js");
const { sendEmail } = require("./../utils/sendEmail.js");

const createBooking = async (req, res) => {
  const { id: eventId } = req.params;
  const event = await Event.findOne({ _id: eventId });
  console.log(new Date());
  if (event.seatsOccupied >= event.seats) {
    throw new CustomError(
      "Bookings are full for this event! Try booking other Events",
      code.BAD_REQUEST
    );
  }
  const isAlreadyBooked = await Booking.findOne({
    user: req.user.userId,
    organizer: event.organizer,
    event: event._id,
  });

  if (isAlreadyBooked) {
    throw new CustomError(
      "You already booked this event. Please book other event",
      code.BAD_REQUEST
    );
  }
  const currentDate = Date.now();
  if (currentDate > Date.parse(event.date)) {
    throw new CustomError(
      "The Event has already finished !!!, try to book other event",
      code.BAD_REQUEST
    );
  }

  const booking = await Booking.create({
    user: req.user.userId,
    organizer: event.organizer,
    event: event._id,
  });
  event.seatsOccupied += 1;
  await event.save();

  await sendEmail(req.user, event, booking);

  res.status(code.CREATED).json({ booking });
};

const showOrganizerBookings = async (req, res) => {
  const bookings = await Booking.find({ organizer: req.user.userId }).populate({
    path: "event",
    select: "title",
  });

  res.status(code.OK).json({ length: bookings.length, bookings });
};

const showUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.userId })
    .populate("event", "title location date _id")
    .populate("organizer", "name _id");
  res.status(code.OK).json({ length: bookings.length, bookings });
};

module.exports = { createBooking, showOrganizerBookings, showUserBookings };
