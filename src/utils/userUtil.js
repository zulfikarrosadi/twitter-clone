const { randomBytes, createHash } = require('crypto');
const { compare, hash, genSalt } = require('bcrypt');

const verifyPassword = async (password, hashedPassword) => {
  const result = await compare(password, hashedPassword);
  return result;
};

const hashUserId = (id) => {
  const randomString = randomBytes(256);
  const randomUserId = createHash('sha256')
    .update(`${id}${randomString}`)
    .digest('hex');
  return randomUserId;
};

const hashPassword = async (password) => {
  const rounds = 10;
  const salt = await genSalt(rounds);
  const hashedPassword = await hash(password, salt);

  return hashedPassword;
};
module.exports = { verifyPassword, hashUserId, hashPassword };
