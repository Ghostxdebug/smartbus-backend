const mongoose = require("mongoose");

module.exports = mongoose.model("Booking", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  busId: mongoose.Schema.Types.ObjectId,
  seatNo: Number
}));
