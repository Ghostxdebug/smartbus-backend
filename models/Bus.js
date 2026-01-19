const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true
  },

  route: {
    type: String,
    required: true
  },

  seats: {
    type: Number,
    required: true
  },

  // 🔹 Bus Schedule (NEW FEATURE)
  schedule: {
    morningTime: {
      type: String,   // e.g. "08:15 AM"
      default: ""
    },
    eveningTime: {
      type: String,   // e.g. "04:45 PM"
      default: ""
    },
    days: {
      type: String,   // e.g. "Mon-Fri"
      default: ""
    }
  },

  // 🔹 Admin enable / disable bus
  enabled: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Bus", busSchema);
