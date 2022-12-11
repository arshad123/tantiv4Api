const logger = require('../startup/logger');
const { error } = require('../helpers/response');

const convertError = function (err) {
  const plainObject = {};
  Object.getOwnPropertyNames(err).forEach(function (key) {
    plainObject[key] = err[key];
  });
  return plainObject;
};

module.exports = function (err, req, res, next) {
  logger.error(err);
  let message = 'Internal Server Error';
  let code = 500;

  if ('type' in err && err.type == 'entity.parse.failed') {
    message = 'Invalid request';
    code = 400;
  }

  if (process.env.MODE != 'production') {
    return res.status(code).json(error(message, code, convertError(err)));
  }
  return res.status(code).json(error(message, code));
};
