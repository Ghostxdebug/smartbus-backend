const mongoose = require("mongoose");

module.exports = mongoose.model("Seat", new mongoose.Schema({
  busId: mongoose.Schema.Types.ObjectId,
  seatNo: Number,
  isBooked: { type: Boolean, default: false }
}));
