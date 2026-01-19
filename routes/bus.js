const express = require("express");
const router = express.Router();

const Bus = require("../models/Bus");
const Seat = require("../models/Seat");
const Booking = require("../models/Booking");

const { auth, adminOnly } = require("../middleware/auth");

/* =========================
   ADD BUS (ADMIN)
========================= */
router.post("/add", auth, adminOnly, async (req, res) => {
  try {
    const { busNumber, route, seats, schedule } = req.body;

    const bus = await Bus.create({
      busNumber,
      route,
      seats,
      schedule
    });

    // Create seats
    for (let i = 1; i <= seats; i++) {
      await Seat.create({
        busId: bus._id,
        seatNo: i,
        isBooked: false
      });
    }

    res.json({ message: "Bus added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add bus" });
  }
});

/* =========================
   DELETE BUS (ADMIN)
========================= */
router.delete("/delete/:id", auth, adminOnly, async (req, res) => {
  try {
    const busId = req.params.id;

    await Seat.deleteMany({ busId });
    await Booking.deleteMany({ busId });
    await Bus.findByIdAndDelete(busId);

    res.json({ message: "Bus deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete bus" });
  }
});

module.exports = router;
