const mongoose = require("mongoose");
const logger = require("./logger");
require("dotenv").config();

module.exports = function () {
  mongoose.set("useFindAndModify", false);
  mongoose.set("useUnifiedTopology", true);
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useCreateIndex", true);
  logger.info("Connecting to db: " + process.env.DB_CONNECTION);
  return mongoose.connect(process.env.DB_CONNECTION);

  // const user = process.env.DB_USER_STAGING;
  // const password = process.env.DB_PASSWORD_STAGING;
  // const name = process.env.DB_NAME_STAGING;
  // const domain = process.env.DB_DOMAIN_STAGING;
  // const authSource = process.env.DB_AUTH_SOURCE_STAGING;

  // let url = "mongodb+srv://";
  // url += domain;
  // url += "/";
  // url += name;
  // // url = encodeURI(url);
  // logger.info("Connecting to db: " + url);
  // return mongoose.connect(url, {
  //   auth: {
  //     authSource: authSource,
  //     user: user,
  //     password: password,
  //   },
  //   useNewUrlParser: true,
  // });
};
