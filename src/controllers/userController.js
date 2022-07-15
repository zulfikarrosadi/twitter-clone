const {
  getUserSettingsService,
  updateUserSettingsService,
  updateUserPasswordService,
} = require('../services/userService');
const getTimelapse = require('../utils/timeUtil');
const { hashPassword } = require('../utils/userUtil');
const { createSession } = require('../services/redisService');
const multer = require('../middlewares/upload');

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

const updateUserPassword = async (req, res) => {
  const { id: userSettingId } = req.user;
  const { newPassword } = req.body;
  try {
    const hashedPassword = await hashPassword(newPassword);
    await updateUserPasswordService(userSettingId, hashedPassword);

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: 'fail to change your password. Please try again' });
  }
};

module.exports = {
  getUserSettings,
  updateUserSettings,
  updateUserPassword,
};
