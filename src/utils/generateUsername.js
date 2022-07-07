const { randomBytes } = require('crypto');

const generateUsername = (name) => {
  const uniquePrefix = randomBytes(5).toString('hex');
  const username = `${name}${uniquePrefix}`;
  return username;
};

module.exports = { generateUsername };
