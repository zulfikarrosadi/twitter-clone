require('dotenv').config();

module.exports = {
  COOKIE_EXP_TIME: 1000 * 3600, // 1 hour in milisecond
  MAX_FILE_ITEM: 10,
  REDIS_URL: process.env.REDIS_URL,
  PRIVATE_KEY: `${process.env.PRIVATE_KEY}`.replace(/\\n/gm, '\n'),
  PUBLIC_KEY: `${process.env.PUBLIC_KEY}`.replace(/\\n/gm, '\n'),
};
