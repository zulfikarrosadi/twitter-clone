// 1000 = 1 second in milisecond
// 3600 = 1 hour in second
const EXP_TIME = 1000 * 3600;
const MAX_FILE_ITEM = 10;
const { REDIS_URL } = process.env;

module.exports = { EXP_TIME, MAX_FILE_ITEM, REDIS_URL };
