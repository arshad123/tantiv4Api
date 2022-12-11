const winston = require('winston');

const printFunction = ({ level, message, timestamp, stack }) => {
  if (stack) {
    // print log trace
    return `${timestamp} - ${level}: ${message} \n ${stack}`;
  }
  return `${timestamp} - ${level}: ${message}`;
};

const dateFormat = { format: 'DD MMM, YYYY HH:mm:ss' };
const console = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.timestamp(dateFormat),
    winston.format.printf(printFunction),
  ),
});

const allLogs = new winston.transports.File({
  filename: './logs/allLogs.log',
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(dateFormat),
    winston.format.printf(printFunction),
  ),
});

const errors = new winston.transports.File({
  filename: './logs/errors.log',
  level: 'error',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(dateFormat),
    winston.format.printf(printFunction),
  ),
});

const enumerateErrorFormat = winston.format((info) => {
  if (info.message instanceof Error) {
    info.message = Object.assign(
      {
        message: info.message.message,
        stack: info.message.stack,
      },
      info.message,
    );
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info,
    );
  }

  return info;
});

const logger = winston.createLogger({
  format: winston.format.combine(enumerateErrorFormat(), winston.format.json()),
  humanReadableUnhandledException: true,
  handleExceptions: true,
  handleRejections: true,
  transports: [allLogs, errors, console],
  exitOnError: true,
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(reason);
});

module.exports = logger;
