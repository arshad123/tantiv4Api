const { error } = require('../helpers/response');

module.exports = function (req, res, next) {
  const token = req.get('Authorization');
  if (!token) {
    return res.status(401).json(error('Access Denied. No token provided.', 401));
  }
  const defaultAuth = settings.defaultAuthToken;
  if (token !== defaultAuth) {
    return res.status(401).json(error('Invalid Token', 401));
  }
  next();
};
