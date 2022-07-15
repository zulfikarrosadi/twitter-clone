const jwt = require('jsonwebtoken');
require('dotenv').config();

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDmje9yt+tJwqegxC4enaXbStZG
zhdUfg4FQzDWjyj85qqyf0Vql0eSHSKGGkjluXqYTcdLRmLqpu6IVosFj2UZtuVQ
mXq6cqF1/Q9N6vIwQrdn/oStnUFLP04Y29T8mHefZPtty4cdtw227dVKQQ05raCE
0KEumW1Zk/W4y8Z/IQIDAQAB
-----END PUBLIC KEY-----`;
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQDmje9yt+tJwqegxC4enaXbStZGzhdUfg4FQzDWjyj85qqyf0Vq
l0eSHSKGGkjluXqYTcdLRmLqpu6IVosFj2UZtuVQmXq6cqF1/Q9N6vIwQrdn/oSt
nUFLP04Y29T8mHefZPtty4cdtw227dVKQQ05raCE0KEumW1Zk/W4y8Z/IQIDAQAB
AoGAFqQxs65kKOY42AzsCo2o0BRVXra2i9GlRtcGYMvGVq/Aa68b/g/FM5Aw58KF
Dipc48AfpkDPTgP+wNze4jjm0KPrVddtNVLkpHFx5Oa6VHIRzVL6lnLc8Ls3wPL7
oztG4iInTxShgKMVT+V0V4JdoKTVnfqbI1oNl87WnZfaXsECQQD7Dz0zRrHH2wmz
NXcrubpXqJcEXiAkIylgJzhbE6uqome7M8hjioCQMXv5nEZNjB2UMALKYp2VD4zA
Toii6Zy1AkEA6xdl3WklJJJDUMIyr1czZXq2sZoqSwBlU3A3viV21tZvJk0+yS0/
5JhVQWESUnHgBNMzQi68uTszRfQEyOyIPQJAMEmNDtixBuyFIBfPdPSC96swaKGl
8u1kXt8MQtA0u1wDMYlTKHoSIimyW58IEpA5fDADyWNQRcQ44R/5vcPK5QJBAITw
okXmY36exzov1wGYShQkpJMiHrBy9NmOJ7d68AzlDc2W+N5CnFLkYbGq9vVwN8IC
vIW8cDQ+6euw5dPJDfECQHi/rXp6Rz4wnVPR9qasOEiiK3jjxP0poV568n0rtac7
vrbE8GSBg+IYA62Y7jgLnSmpS/vl1Wlr9S4Arza9x9Y=
-----END RSA PRIVATE KEY-----`;

const createToken = (
  userSettingId,
  userProfileId,
  { accessSessionId, refreshSessionId = null },
) => {
  const accessToken = jwt.sign(
    { userProfileId, userSettingId, accessSessionId },
    PRIVATE_KEY,
    { algorithm: 'RS512', expiresIn: '10s' },
  );

  const refreshToken = jwt.sign(
    { userProfileId, userSettingId, refreshSessionId },
    PRIVATE_KEY,
    { algorithm: 'RS512' },
  );

  return { accessToken, refreshToken };
};

const verifyJwt = (token) => {
  try {
    const decoded = jwt.verify(token, PUBLIC_KEY);
    return { payload: decoded };
  } catch (error) {
    return { payload: null };
  }
};

module.exports = { createToken, verifyJwt };
