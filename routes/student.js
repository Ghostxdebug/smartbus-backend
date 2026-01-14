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

router.post("/book", auth, async(req,res)=>{
  const seat = await Seat.findOne(req.body);
  if(seat.isBooked) return res.json({message:"Already booked"});
  seat.isBooked=true;
  await seat.save();
  await Booking.create({...req.body, userId:req.user.id});
  res.json({message:"Booked"});
});

router.get("/my-bookings", auth, async(req,res)=>{
  res.json(await Booking.find({userId:req.user.id}).populate("busId"));
});

module.exports = router;
