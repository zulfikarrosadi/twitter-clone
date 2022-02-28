const { createUser, getUser } = require('../services/userService');
const { uniqueConstraintErrorHandler } = require('../utils/userErrorHandler');
const hashPassword = require('../utils/hashPassword');
const getTimelapse = require('../utils/getTimelapse');
const verifyPassword = require('../utils/verifyPassword');
const createHashUserId = require('../utils/hashUserId');
const config = require('../constant/config');

const addUser = async (req, res) => {
  const beforeTime = new Date().getTime();
  const { email, password, username } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const result = await createUser(email, hashedPassword, username);

    const timelapse = getTimelapse(beforeTime);

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      userId: result.id,
      error: null,
    });
  } catch (error) {
    console.log('catch', req.body);
    console.log(error);
    return res.status(400).json({
      timelapse: null,
      userId: null,
      errors: uniqueConstraintErrorHandler(error.message, req.body),
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUser(email);
    if (!user) throw new Error('No user email');

    const isVerified = await verifyPassword(password, user.password);
    if (!isVerified) throw new Error('Wrong password');

    const hashedUserId = createHashUserId(user.id);

    // store username and hashedUserId(as a key) in redis

    return res
      .status(200)
      .cookie('JERAWAT', hashedUserId, {
        maxAge: config.ONE_HOUR,
        SameSite: 'Lax',
        httpOnly: true,
      })
      .json({ message: 'ok' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// eslint-disable-next-line arrow-body-style
const logOutUser = async (req, res) => {
  // remove user information on redis
  return res.status(200).cookie('JERAWAT', '', { maxAge: 1 }).send('Log out');
};

module.exports = { addUser, loginUser, logOutUser };
