const { decode } = require('jsonwebtoken');
const { getRefreshToken } = require('../services/redisService');
const { createToken, verifyJwt } = require('../utils/jwtUtil');
const { generateSessionId } = require('../utils/sessionUtil');

const deserializeUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  // check integrity of access token

  if (!accessToken) return next();
  const { payload: accessPayload } = verifyJwt(accessToken);

  if (accessPayload) {
    req.user = accessPayload;
    return next();
  }

  // if access token is invalid, then check the integrity of refresh token

  if (!refreshToken) return next();
  const { payload: refreshPayload } = verifyJwt(refreshToken);
  if (!refreshPayload) return next();

  const isRefreshTokenValid = await getRefreshToken(
    refreshPayload.refreshSessionId,
  );
  if (!isRefreshTokenValid) return next();

  const { accessToken: newAccessToken } = createToken(
    refreshPayload.userSettingId,
    refreshPayload.userProfileId,
    { accessSessionId: generateSessionId().accessSessionId },
  );

  res.cookie('accessToken', newAccessToken, { httpOnly: true });
  req.user = decode(newAccessToken);

  return next();
};

module.exports = { deserializeUser };
