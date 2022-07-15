const { randomBytes } = require('crypto');
const { saveRefreshToken } = require('../services/redisService');
const { createToken } = require('./jwtUtil');

const generateSessionId = () => ({
  accessSessionId: randomBytes(32).toString('hex'),
  refreshSessionId: randomBytes(32).toString('hex'),
});

const createSession = async (res, userProfileId, userSettingId) => {
  const { accessSessionId, refreshSessionId } = generateSessionId();

  const { accessToken, refreshToken } = createToken(
    userSettingId,
    userProfileId,
    {
      accessSessionId,
      refreshSessionId,
    },
  );

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    SameSite: 'Lax',
  });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, SameSite: 'Lax' });
  await saveRefreshToken(refreshSessionId, refreshToken);
};

module.exports = { createSession, generateSessionId };
