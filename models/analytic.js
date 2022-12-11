const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    deviceId: {
      type: Number,
      required: true,
    },
    clientIp: {
      type: String,
      ref: "Event",
      required: true,
    },
    hostName: {
      type: String,
      required: true,
    },
    download: {
      type: Number,
      required: true,
    },
    upload: {
      type: Number,
      required: true,
    },
    useageSeconds: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { timestamps: true },
);

const Analytic = mongoose.model("Analytic", analyticsSchema, "analytics");

module.exports.Analytic = Analytic;
