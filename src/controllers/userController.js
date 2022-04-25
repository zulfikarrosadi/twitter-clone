const {
  createUser,
  getUser,
  getUserSettingsService,
  updateUserSettingsService,
} = require('../services/userService');
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
const { RequestError } = require('../errors/RequestError');
const multer = require('../middlewares/upload');

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

const getUserSettings = async (req, res) => {
  try {
    const userSettings = await getUserSettingsService(req.user.userId);

    return res.status(200).json(userSettings);
  } catch (error) {
    return res.status(400).json({ message: 'something went wrong, try again' });
  }
};

const updateUserSettings = async (req, res) => {
  const beforeTime = new Date().getTime();
  const upload = multer.single('avatar');

  upload(req, res, async (e) => {
    const { username, dateOfBirth } = req.body;
    const { userId, username: oldUsername } = req.user;
    const { JERAWAT } = req.cookies;
    const isUsernameEdited = username !== oldUsername;
    let avatar;

    try {
      if (e) throw e;
      if (!username && !dateOfBirth) throw Error('settings is null');
      if (!req.file) avatar = null;
      else avatar = req.file.filename;
      if (isUsernameEdited) {
        await createSession(JERAWAT, { userId, username });
      }

      await updateUserSettingsService(
        userId,
        username,
        avatar,
        dateOfBirth,
        isUsernameEdited,
      );
      const timelapse = getTimelapse(beforeTime);

      return res
        .status(200)
        .json({ timelapse: `${timelapse} ms`, error: null });
    } catch (error) {
      return res.status(400).json({
        timelapse: null,
        error: error.message,
      });
    }
  });
};

module.exports = {
  addUser,
  loginUser,
  logOutUser,
  getUserSettings,
  updateUserSettings,
};
