const { createUser, getUser } = require('../services/userService');
const { uniqueConstraintErrorHandler } = require('../utils/userErrorHandler');
const getTimelapse = require('../utils/timeUtil');
const { EXP_TIME } = require('../constant/config');
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
      id: user.id,
      username: user.username,
    });

    const timelapse = getTimelapse(beforeTime);
    const data = await getSession(hashedUserId);

    return res
      .status(201)
      .cookie('JERAWAT', hashedUserId, {
        maxAge: EXP_TIME,
        SameSite: 'Lax',
        httpOnly: true,
      })
      .json({
        timelapse: `${timelapse} ms`,
        error: null,
        user: JSON.parse(data),
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      timelapse: null,
      userId: null,
      errors: uniqueConstraintErrorHandler(error.message, req.body),
    });
  }
};

const loginUser = async (req, res) => {
  const beforeTime = new Date().getTime();
  const { email, password } = req.body;
  try {
    const user = await getUser(email);
    if (!user) throw new Error('No user email');

    const isVerified = await verifyPassword(password, user.password);
    if (!isVerified) throw new Error('Wrong password');

    const hashedUserId = hashUserId(user.id);

    await createSession(hashedUserId, {
      userId: user.id,
      username: user.username,
    });
    const timelapse = getTimelapse(beforeTime);

    return res
      .status(200)
      .cookie('JERAWAT', hashedUserId, {
        maxAge: EXP_TIME,
        SameSite: 'Lax',
        httpOnly: true,
      })
      .json({
        timelapse: `${timelapse} ms`,
        error: null,
        user: { id: user.id, username: user.username },
      });
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
