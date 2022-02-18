const { randomBytes, createHash } = require('crypto');

const createHashUserId = (id) => {
  const randomString = randomBytes(256);
  const randomUserId = createHash('sha256')
    .update(`${id}${randomString}`)
    .digest('hex');
  return randomUserId;
};

module.exports = createHashUserId;
