const jwt = require('jsonwebtoken');

const expiryTime = '2d';

function generateAuthToken(loginUserType, id) {
  let key = '';
  if (loginUserType == 'admin') {
    key = settings.jwtAdminPrivateKey;
  } else if (loginUserType == 'user') {
    key = settings.jwtUserPrivateKey;
  } else {
    throw new Error('Invalid type.');
  }
  return jwt.sign(
    {
      id: id,
      userType: loginUserType,
    },
    key,
    { expiresIn: expiryTime },
  );
}

function verifyAuthToken(type, token) {
  let key = '';
  if (type === 'admin') {
    key = settings.jwtAdminPrivateKey;
  } else if (type == 'user') {
    key = settings.jwtUserPrivateKey;
  } else {
    throw new Error('Invalid type.');
  }
  return jwt.verify(token, key);
}

exports.generateAuthToken = generateAuthToken;
exports.verify = verifyAuthToken;
