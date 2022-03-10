const { createClient } = require('redis');
const { ONE_HOUR } = require('../constant/config');

let redisClient;
(async () => {
  try {
    redisClient = createClient('5000');
    // redisClient.auth({
    //   username: 'zulfikar',
    //   password: 'zulfikarpassword',
    // });

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
    EX: ONE_HOUR,
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
