const { createClient } = require('redis');
const { EXP_TIME, REDIS_URL } = require('../constant/config');

let redisClient;
(async () => {
  try {
    redisClient = createClient({ url: REDIS_URL });

    redisClient.on('error', (err) => console.log(`client error ${err}`));
    redisClient.on('ready', () => console.log('im ready'));
    redisClient.on('connect', () => console.log('connected'));

    await redisClient.connect();
  } catch (error) {
    console.log(error);
  }
})();

const createSession = async (key, data) => {
  await redisClient.set(key, JSON.stringify(data), {
    EX: EXP_TIME,
  });
};

const getSession = async (key) => {
  const session = await redisClient.get(key);
  return session;
};

const deleteSession = async (key) => {
  await redisClient.del(key);
};

module.exports = { createSession, getSession, deleteSession };
