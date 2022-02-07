const { genSalt, hash } = require('bcrypt');

/**
 * Hash the password using bcrypt
 * @param string password
 * @returns hashed password
 */
const hashPassword = async (password) => {
  const rounds = 10;
  const salt = await genSalt(rounds);
  const hashedPassword = await hash(password, salt);

  return hashedPassword;
};

module.exports = hashPassword;
