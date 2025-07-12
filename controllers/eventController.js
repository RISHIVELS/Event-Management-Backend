const CustomError = require("./../error/customError.js");
const { StatusCodes: code } = require("http-status-codes");
const Event = require("./../models/Event.js");
const verifyPermission = require("../utils/verifyPermission.js");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const QRCode = require("qrcode");

const createEvent = async (req, res) => {
  const { userId: organiserId } = req.user;
  const event = await Event.create({ ...req.body, organizer: organiserId });
  res.status(code.CREATED).json({ event });
};

const getAllEvents = async (req, res) => {
  const events = await Event.find({});
  res.status(code.OK).json({ length: events.length, events });
};

const getSingleEvent = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findOne({ _id: id });
  if (!event) {
    throw new CustomError(`No Event found with the id : ${id}`);
  }
  res.status(code.OK).json({ event });
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const eventTofind = await Event.findById(id);
  const resourcerId = eventTofind.organizer;

  verifyPermission(req.user.userId, resourcerId, res);

  const event = await Event.findByIdAndUpdate(id, req.body, { new: true });
  if (!event) {
    throw new CustomError(`No Event found with the id : ${id}`, code.FORBIDDEN);
  }

  res.status(code.OK).json({ event });
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const eventTofind = await Event.findById(id);
  const resourcerId = eventTofind.organizer;
  verifyPermission(req.user.userId, resourcerId, res);

  const event = await Event.findByIdAndDelete(id);
  if (!event) {
    throw new CustomError(`No Event found with the id : ${id}`);
  }
  res.status(code.OK).json({ msg: "Event deleted successfully" });
};

const showMyEvents = async (req, res) => {
  const { userId: organizerId } = req.user;
  const events = await Event.find({ organizer: organizerId });
  res.status(code.OK).json({ length: events.length, events });
};

const imageUploader = async (req, res) => {
  const image = req.files.image;
  const result = await cloudinary.uploader.upload(image.tempFilePath, {
    use_filename: true,
    folder: "Events",
  });
  fs.unlinkSync(image.tempFilePath);
  res.status(code.CREATED).json({ image: { src: result.secure_url } });
};

module.exports = {
  getSingleEvent,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  showMyEvents,
  imageUploader,
};
