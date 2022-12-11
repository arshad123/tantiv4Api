const jwt = require("../helpers/jwt");
const { error } = require("../helpers/response");
const { RefreshToken } = require("../models/refreshToken");
const { Admin } = require("../models/admin");
const mongoose = require("mongoose");

module.exports = function (...roles) {
  return async function (req, res, next) {
    if (!roles || roles.length === 0) {
      next();
      return;
    }
    const token = req.get("jwt");

    if (!roles.includes("none") && (token == undefined || token == "null" || token == null)) {
      return res.status(401).json(error("Access Denied. No jwt token provided.", 401));
    }

    if (roles.includes("none") && (token == undefined || token == "null" || token == null)) {
      next();
      return;
    }

    const now = new Date();
    const refreshToken = await RefreshToken.findOne({ jwt: token });
    if (!refreshToken) return res.status(401).json(error("Invalid jwt Token", 401));
    if (refreshToken.expiresAt < now || refreshToken.deletedAt)
      return res.status(401).json(error("session expired", 401));

    for (const role of roles) {
      if (role === "none") {
        // Do nothing. This is to support opional authorization only.
        next();
        return;
      } else if (role === "admin") {
        try {
          const adminAuth = jwt.verify("admin", token);
          if (adminAuth) {
            const user = await Admin.findOne({
              _id: mongoose.Types.ObjectId(adminAuth.id),
              deletedAt: null,
            });
            if (!user.isActive) return res.status(401).json(error("Invalid jwt Token", 401));
            req.user = user;
            req.user.userType = "admin";
            req.user.id = adminAuth._id;
            req.user.isAdmin = true;
            continue;
          }
        } catch (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json(error("jwt token expired", 401));
          } else {
            // User not found.
          }
        }
      }
    }
    if (req.user) {
      next();
    } else {
      return res.status(401).json(error("Invalid jwt Token", 401));
    }
  };
};
