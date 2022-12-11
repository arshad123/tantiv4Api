const mongoose = require('mongoose');
const randomToken = require('rand-token');
const moment = require('moment');

const refreshTokenSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ['admin', 'user'],
    },
    jwt: String,
    userId: mongoose.Types.ObjectId,
    expiresAt: Date,
    deviceInfo: String,
    deletedAt: Date,
    token: String,
  },
  { timestamps: true },
);

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema, 'refreshTokens');

async function createRefreshToken(userType, id, jwt) {
  const expiresAt = moment().add(24, 'hours');
  const token = new RefreshToken({
    userType: userType,
    userId: id,
    expiresAt: expiresAt,
    deviceInfo: '',
    deletedAt: null,
    jwt: jwt,
  });
  const epoch = Math.floor(new Date().getTime() / 1000);
  const refreshToken = randomToken.suid(256, epoch);
  token.token = refreshToken;

  const result = await token.save();
  return refreshToken;
}

exports.createRefreshToken = createRefreshToken;
exports.RefreshToken = RefreshToken;
