const cron = require('node-cron');
const logger = require('../startup/logger');

// cron.schedule('0 0 0 * * *', async () => {
//   /*
//    * Runs every day
//    * at 00:00:00 AM.
//    */
//   logger.info('Starting Cron jobs...');

//   logger.info('Cron jobs completed.');
// });

module.exports = cron;
