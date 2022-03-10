const { createUser, getUser } = require('../services/userService');
const { uniqueConstraintErrorHandler } = require('../utils/userErrorHandler');
const getTimelapse = require('../utils/timeUtil');
const config = require('../constant/config');
const {
  verifyPassword,
  hashPassword,
  hashUserId,
} = require('../utils/userUtil');
const {
  createSession,
  getSession,
  deleteSession,
} = require('../services/redisService');

const addUser = async (req, res) => {
  const beforeTime = new Date().getTime();
  const { email, password, username } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = await createUser(email, hashedPassword, username);
    const hashedUserId = hashUserId(user.id);

    await createSession(hashedUserId, {
      userId: user.id,
      username: user.username,
    });

    const timelapse = getTimelapse(beforeTime);
    const data = getSession(hashedUserId);
    console.log(data);

    return res
      .status(200)
      .cookie('JERAWAT', hashedUserId, {
        maxAge: config.ONE_HOUR,
        SameSite: 'Lax',
        httpOnly: true,
      })
      .json({
        timelapse: `${timelapse} ms`,
        userId: user.id,
        error: null,
        data,
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

    const hashedUserId = hashUserId(user.id);

    // store username and hashedUserId(as a key) in redis
    await createSession(hashedUserId, {
      userId: user.id,
      username: user.username,
    });

    return res
      .status(200)
      .cookie('JERAWAT', hashedUserId, {
        maxAge: config.ONE_HOUR,
        SameSite: 'Lax',
        httpOnly: true,
      })
      .json({ message: 'ok', username: user.username });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const logOutUser = async (req, res) => {
  try {
    // remove user information on redis
    const { JERAWAT } = req.cookies;

    await deleteSession(JERAWAT);

    return res.status(200).cookie('JERAWAT', '', { maxAge: 1 }).send('Log out');
  } catch (error) {
    return res.status(500).send('error');
  }
};

module.exports = {
  addUser,
  loginUser,
  logOutUser,
};
