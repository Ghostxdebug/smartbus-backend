const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true
  },
  seatNo: {
    type: Number,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Seat", seatSchema);
