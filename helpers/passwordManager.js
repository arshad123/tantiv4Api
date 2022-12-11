const bcrypt = require('bcrypt');

async function hash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function compare(password, hash) {
  return await bcrypt.compare(password, hash);
}

exports.hash = hash;
exports.compare = compare;
