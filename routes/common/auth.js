const express = require("express");
const router = express.Router();
const _ = require("lodash");
const passwordManager = require("../../helpers/passwordManager");
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");
const response = require("../../helpers/response");
const { Admin, validateAdminLogin } = require("../../models/admin");
const { RefreshToken, createRefreshToken } = require("../../models/refreshToken");

// Admin Apis
router.post("/admins", async (req, res) => {
  const { error } = validateAdminLogin(req.body);
  if (error) return res.status(400).json(response.validationError(error));

  const user = await Admin.findOne({
    email: req.body.email,
    isActive: true,
  });
  if (!user) return res.status(403).json(response.error("Invalid email", 403));
  if (!user.isActive) return res.status(403).json(response.error("Account is not active", 403));

  const validPassword = await passwordManager.compare(req.body.password, user.password);
  if (!validPassword) return res.status(403).json(response.error("Invalid password", 403));

  const token = user.generateAuthToken();
  const resp = _.pick(user, ["_id", "firstName", "lastName", "role", "email"]);

  resp.jwt = token;
  resp.refreshToken = await createRefreshToken("admin", user._id, token);

  res.status(200).json(response.success(resp));
});

module.exports = router;
