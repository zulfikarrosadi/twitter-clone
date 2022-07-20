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

const hasOwnAvatarAndBanner = (files) => {
  let avatar;
  let banner;

  if (Object.prototype.hasOwnProperty.call(files, 'avatar')) {
    avatar = files.avatar[0].filename;
  } else {
    avatar = null;
  }

  if (Object.prototype.hasOwnProperty.call(files, 'banner')) {
    banner = files.banner[0].filename;
  } else {
    banner = null;
  }

  return { avatar, banner };
};

const userProfileData = (name, bio, website, avatar, banner) => {
  if (!name.trim() && !bio.trim() && !website.trim() && !avatar && !banner) {
    return false;
  }
  return true;
};

module.exports = {
  verifyPassword,
  hashUserId,
  hashPassword,
  hasOwnAvatarAndBanner,
  userProfileData,
};
