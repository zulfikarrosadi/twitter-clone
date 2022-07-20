const { generateUsername } = require('../utils/generateUsername');
const getTimelapse = require('../utils/timeUtil');
const { RequestError } = require('../errors/RequestError');
const { deleteSession } = require('../services/redisService');
const { uniqueConstraintErrorHandler } = require('../utils/userErrorHandler');
const { createSession } = require('../utils/sessionUtil');
const {
  getUserSettingsService,
  createUserProfile,
  createUserSettings,
} = require('../services/userService');
const { verifyPassword, hashPassword } = require('../utils/userUtil');

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
    const userProfile = await createUserProfile(
      name,
      null,
      null,
      userSettings.id,
    );

    await createSession(res, userProfile.id, userSettings.id);
    const timelapse = getTimelapse(beforeTime);

    return res.status(201).json({
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
  const { email, password } = req.body;
  try {
    const user = await getUserSettingsService(email);
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
        maxAge: COOKIE_EXP_TIME,
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

module.exports = { addUser, loginUser, logOutUser };
