const logger = require("./startup/logger");
const express = require("express");
const app = express();
require("dotenv").config();
const { Setting } = require("./models/setting");
require("./helpers/String");
require("./startup/config")();
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/crons");
require("./startup/db")()
  .then(() => {
    logger.info("Connected to MongoDB");
    startApp();
  })
  .catch((e) => {
    logger.error("Couldn't connect to MongoDB with error \n" + e);
  });

global.isDevelopmentMode = process.env.MODE == "development";
global.settings = new Setting({});
global.fileUploadPath = "";

async function startApp() {
  const sett = await Setting.find();
  if (sett.length > 0) {
    // Store Settings
    settings = sett[0];
    // Store upload path on a global veriable
    // const mediaURL = new URL(settings.mediaServerURL);
    const port = 8081;
    const server = app.listen(port, () => logger.info(`Listening on port - ${port}`));
  } else {
    throw new Error("Settings are not available");
  }
}
