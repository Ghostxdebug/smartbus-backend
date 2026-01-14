const express = require("express");
const Booking = require("../models/Booking");
const {auth,adminOnly} = require("../middleware/auth");

const router = express.Router();

router.get("/bookings", auth, adminOnly, async(req,res)=>{
  res.json(await Booking.find().populate("userId").populate("busId"));
});

module.exports = router;
