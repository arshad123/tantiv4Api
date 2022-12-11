const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("../helpers/jwt");
const PasswordComplexity = require("joi-password-complexity");
const complexity = new PasswordComplexity({
  min: 8,
  max: 16,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
});

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 1024,
    },
    role: {
      type: String,
      enum: ["masteradmin"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

adminSchema.methods.generateAuthToken = function () {
  return jwt.generateAuthToken("admin", this._id);
};

function validateLogin(login) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(50).required(),
    password: Joi.string().required(),
  });
  return schema.validate(login);
}

module.exports.Admin = mongoose.model("Admin", adminSchema, "admins");
module.exports.validateAdminLogin = validateLogin;
