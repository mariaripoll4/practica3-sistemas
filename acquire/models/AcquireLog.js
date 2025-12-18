const mongoose = require("mongoose");

const AcquireLogSchema = new mongoose.Schema({
  features: {
    type: [Number],
    required: true
  },
  featureCount: {
    type: Number,
    required: true,
    default: 7
  },
  scalerVersion: {
    type: String,
    default: "v1"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AcquireLog", AcquireLogSchema);
