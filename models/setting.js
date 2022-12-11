const mongoose = require("mongoose");
const Joi = require("joi");

const settingSchema = new mongoose.Schema(
  {
    jwtAdminPrivateKey: {
      type: String,
      requried: true,
    },
    jwtUserPrivateKey: {
      type: String,
      requried: true,
    },
    defaultAuthToken: {
      type: String,
      requried: true,
    },
  },
  { timestamps: true },
);

module.exports.Setting = mongoose.model("Setting", settingSchema, "settings");
module.exports.settingSchema = settingSchema;
