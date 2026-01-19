const express = require("express");
const Bus = require("../models/Bus");
const Seat = require("../models/Seat");
const Booking = require("../models/Booking");
const {auth} = require("../middleware/auth");

const router = express.Router();

router.get("/buses", auth, async(req,res)=>{
  res.json(await Bus.find());
});

router.get("/seats/:busId", auth, async(req,res)=>{
  res.json(await Seat.find({busId:req.params.busId}));
});
router.post("/book", auth, async (req, res) => {
  const { busId, seatNo } = req.body;

  // Find seat
  const seat = await Seat.findOne({ busId, seatNo });

  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seat.isBooked) {
    return res.status(400).json({ message: "Seat already booked" });
  }

  // Mark seat booked
  seat.isBooked = true;
  await seat.save();

  // Create booking
  await Booking.create({
    userId: req.user.id,
    busId,
    seatNo
  });

  res.json({ message: "Seat booked successfully" });
});


router.get("/my-bookings", auth, async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id })
    .populate("busId", "busNumber route");

  res.json(bookings);
});


module.exports = router;

router.post("/cancel", auth, async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.json({ message: "Booking not found" });

  await Seat.findOneAndUpdate(
    { busId: booking.busId, seatNo: booking.seatNo },
    { isBooked: false }
  );

  await booking.deleteOne();
  res.json({ message: "Booking cancelled" });
});
