const { generateUsername } = require('../utils/generateUsername');
const getTimelapse = require('../utils/timeUtil');
const { RequestError } = require('../errors/RequestError');
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
      user: { id: userSettings.id, username: userSettings.username },
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
  const { userIdentifier, password } = req.body;

  const userQuery = {};

  if (userIdentifier.includes('@')) {
    userQuery.email = userIdentifier;
  } else {
    userQuery.username = userIdentifier;
  }

  try {
    const {
      password: hashedPassword,
      user: userProfileId,
      id: userSettingId,
    } = await getUserSettingsService(userQuery);

    const isVerified = await verifyPassword(password, hashedPassword);
    if (!isVerified) {
      throw new RequestError('Email or password is incorrect', 400);
    }

    await createSession(res, userProfileId[0].id, userSettingId);

    const timelapse = getTimelapse(beforeTime);

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(error.code || 400)
      .json({ error: 'Email or password is incorrect' });
  }
};

const logOutUser = async (req, res) => {
  try {
    req.user = null;
    return res
      .status(204)
      .cookie('accessToken', '', { maxAge: 1 })
      .cookie('refreshToken', '', { maxAge: 1 })
      .send('success');
  } catch (error) {
    return res.status(400).send("something is wrong, let's go back to home");
  }
};

module.exports = { addUser, loginUser, logOutUser };
