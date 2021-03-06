const {
  getUserSettingsService,
  updateUserSettingsService,
  createUserProfile,
  createUserSettings,
} = require('../services/userService');
const { uniqueConstraintErrorHandler } = require('../utils/userErrorHandler');
const getTimelapse = require('../utils/timeUtil');
const { EXP_TIME } = require('../constant/config');
const {
  verifyPassword,
  hashPassword,
  hashUserId,
} = require('../utils/userUtil');
const { createSession, deleteSession } = require('../services/redisService');
const { RequestError } = require('../errors/RequestError');
const multer = require('../middlewares/upload');
const { generateUsername } = require('../utils/generateUsername');

const addUser = async (req, res) => {
  const beforeTime = new Date().getTime();
  const { email, password, dateOfBirth, name } = req.body;
  const username = generateUsername(name);

  try {
    const hashedPassword = await hashPassword(password);
    const userSettings = await createUserSettings(
      username,
      email,
      hashedPassword,
      dateOfBirth,
    );

    const hashedUserId = hashUserId(userSettings.id);
    await createUserProfile(name, null, null, userSettings.id);
    await createSession(hashedUserId, { id: userSettings.id, username });

    const timelapse = getTimelapse(beforeTime);

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
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      timelapse: null,
      error: uniqueConstraintErrorHandler(error.message, req.body),
    });
  }
};

const loginUser = async (req, res) => {
  const beforeTime = new Date().getTime();
  const { username, password } = req.body;
  try {
    const user = await getUserSettingsService(username);
    if (!user) throw new RequestError('Email or password is incorrect', 400);

    const isVerified = await verifyPassword(password, user.password);
    if (!isVerified) {
      throw new RequestError('Email or password is incorrect', 400);
    }

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
      });
  } catch (error) {
    return res.status(error.code).json({ error: error.message });
  }
};

const logOutUser = async (req, res) => {
  try {
    const { JERAWAT } = req.cookies;
    await deleteSession(JERAWAT);

    return res.status(200).cookie('JERAWAT', '', { maxAge: 1 });
  } catch (error) {
    return res.status(400).send("something is wrong, let's go back to home");
  }
};

const getUserSettings = async (req, res) => {
  try {
    const userSettings = await getUserSettingsService(req.user.username);

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
    const { userId } = req.user;
    const { JERAWAT } = req.cookies;
    let avatar;

    try {
      if (e) throw e;
      if (!username && !dateOfBirth) throw Error('settings is null');
      if (!req.file) avatar = null;
      else avatar = req.file.filename;

      await updateUserSettingsService(userId, username, avatar, dateOfBirth);
      await createSession(JERAWAT, { userId, username });
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
