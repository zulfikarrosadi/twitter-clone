const { compare } = require('bcrypt');

const verifyPassword = async (password, hashedPassword) => {
  const result = await compare(password, hashedPassword);
  return result;
};

module.exports = verifyPassword;
