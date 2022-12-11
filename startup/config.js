require("dotenv").config();
module.exports = function () {
  if (!process.env.MODE) {
    throw new Error("FATAL ERROR: MODE is not defined");
  }

  // if (!process.env.DB_CONNECTION) {
  //   throw new Error("FATAL ERROR: DB_USER_STAGING is not defined");
  // }
};
