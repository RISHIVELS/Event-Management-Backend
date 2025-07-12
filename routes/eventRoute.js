const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeUser,
} = require("./../middlewares/authentication.js");
const {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  showMyEvents,
  imageUploader,
} = require("./../controllers/eventController.js");

router
  .route("/")
  .post(authenticateUser, authorizeUser("organizer"), createEvent)
  .get(authenticateUser, getAllEvents);
router
  .route("/showMyEvents")
  .get(authenticateUser, authorizeUser("organizer"), showMyEvents);
router
  .route("/event-image-upload")
  .post(authenticateUser, authorizeUser("organizer"), imageUploader);

router
  .route("/:id")
  .get(authenticateUser, getSingleEvent)
  .patch(authenticateUser, authorizeUser("organizer"), updateEvent)
  .delete(authenticateUser, authorizeUser("organizer"), deleteEvent);

module.exports = router;
