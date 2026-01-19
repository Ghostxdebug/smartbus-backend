const express = require("express");
const Bus = require("../models/Bus");
const Seat = require("../models/Seat");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

const router = express.Router();

/* =========================
   GET ALL BUSES
========================= */
router.get("/buses", auth, async (req, res) => {
  const buses = await Bus.find({ enabled: true });
  res.json(buses);
});

/* =========================
   GET SINGLE BUS (SCHEDULE)
========================= */
router.get("/bus/:id", auth, async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    return res.status(404).json({ message: "Bus not found" });
  }
  res.json(bus);
});

/* =========================
   GET SEATS
========================= */
router.get("/seats/:busId", auth, async (req, res) => {
  const seats = await Seat.find({ busId: req.params.busId });
  res.json(seats);
});

/* =========================
   BOOK SEAT
========================= */
router.post("/book", auth, async (req, res) => {
  const { busId, seatNo } = req.body;

  const seat = await Seat.findOne({ busId, seatNo });
  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seat.isBooked) {
    return res.status(400).json({ message: "Seat already booked" });
  }

  seat.isBooked = true;
  await seat.save();

  await Booking.create({
    userId: req.user.id,
    busId,
    seatNo
  });

  res.json({ message: "Seat booked successfully" });
});

/* =========================
   MY BOOKINGS
========================= */
router.get("/my-bookings", auth, async (req, res) => {
  const bookings = await Booking.find({
    userId: req.user.id
  }).populate("busId", "busNumber route schedule");

  res.json(bookings);
});

/* =========================
   CANCEL BOOKING
========================= */
router.post("/cancel", auth, async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.json({ message: "Booking not found" });
  }

  await Seat.findOneAndUpdate(
    { busId: booking.busId, seatNo: booking.seatNo },
    { isBooked: false }
  );

  await booking.deleteOne();
  res.json({ message: "Booking cancelled" });
});

/* =========================
   EXPORT ROUTER (MUST BE LAST)
========================= */
module.exports = router;
