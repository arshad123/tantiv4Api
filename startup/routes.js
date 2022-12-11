const express = require("express");
require("express-async-errors");
const error = require("../middleware/error");
const defaultAuth = require("../middleware/defaultAuth");
const helmet = require("helmet");
// const settings = require("../routes/common/settings");
// const comments = require("../routes/event/comments");
const auth = require("../routes/common/auth");
// const users = require("../routes/user/users");
// const admins = require("../routes/admin/admins");
const dashboard = require("../routes/dashboard/dashboard");
// const forumCategories = require("../routes/forum/forumCategories");
// const forumTopics = require("../routes/forum/forumTopics");
// const donation = require("../routes/donate/donation");

// const notableAchievements = require("../routes/notableAchievements/notableAchievements");

// const contactUs = require("../routes/common/contactUs");

const cors = require("cors");

module.exports = function (app) {
  app.options("*", cors());
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(defaultAuth);
  app.use("/auth", auth);
  app.use("/dashboard", dashboard);

  app.use(error);
};
