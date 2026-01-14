const express = require("express");
const Bus = require("../models/Bus");
const Seat = require("../models/Seat");
const {auth,adminOnly} = require("../middleware/auth");

const router = express.Router();

router.post("/add", auth, adminOnly, async (req,res)=>{
  const bus = await Bus.create(req.body);
  for(let i=1;i<=req.body.seats;i++){
    await Seat.create({busId:bus._id, seatNo:i});
  }
  res.json({message:"Bus added"});
});

module.exports = router;
