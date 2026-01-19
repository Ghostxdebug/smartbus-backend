const express = require("express");
const Booking = require("../models/Booking");
const {auth,adminOnly} = require("../middleware/auth");

const router = express.Router();
router.get("/bookings", auth, adminOnly, async (req, res) => {
  const bookings = await Booking.find()
    .populate("userId", "name email")
    .populate("busId", "busNumber route");

  res.json(bookings);
});


router.post("/cancel-booking", auth, adminOnly, async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  // Free the seat
  await Seat.findOneAndUpdate(
    { busId: booking.busId, seatNo: booking.seatNo },
    { isBooked: false }
  );

  await booking.deleteOne();

  res.json({ message: "Booking cancelled successfully" });
});

module.exports = router;
