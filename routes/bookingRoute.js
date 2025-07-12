const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeUser,
} = require("./../middlewares/authentication.js");
const {
  createBooking,
  showOrganizerBookings,
  showUserBookings,
} = require("./../controllers/bookingController.js");

router.route("/showUserBookings").get(authenticateUser, showUserBookings);
router
  .route("/showOrganizerBookings")
  .get(authenticateUser, authorizeUser("organizer"), showOrganizerBookings);
router.route("/:id").get(authenticateUser, createBooking);

module.exports = router;
