const mongoose = require("mongoose");

module.exports = mongoose.model("Bus", new mongoose.Schema({
  busNumber: String,
  route: String
}));
