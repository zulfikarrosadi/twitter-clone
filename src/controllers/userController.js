const {
  getUserSettingsService,
  updateUserSettingsService,
  updateUserPasswordService,
  updateUserProfileService,
} = require('../services/userService');
const getTimelapse = require('../utils/timeUtil');
const {
  hashPassword,
  hasOwnAvatarAndBanner,
  userProfileData,
} = require('../utils/userUtil');
const { createSession } = require('../services/redisService');
const multer = require('../middlewares/upload');
const { RequestError } = require('../errors/RequestError');

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
  const { username, dateOfBirth, genderId } = req.body;
  const { userSettingId } = req.user;

  try {
    if (!username && !dateOfBirth && !genderId) {
      throw new RequestError('User settings data is empty');
    }

    await updateUserSettingsService(
      userSettingId,
      username,
      dateOfBirth,
      parseInt(genderId, 10),
    );
    const timelapse = getTimelapse(beforeTime);

    return res
      .status(200)
      .json({ message: 'success', timelapse: `${timelapse} ms`, error: null });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'failed', timelapse: null, error });
  }
};

const updateUserPassword = async (req, res) => {
  const { userSettingId } = req.user;
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

const updateUserProfile = async (req, res) => {
  const beforeTime = new Date().getTime();
  const upload = multer.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]);

  upload(req, res, async (e) => {
    const { name, bio, website } = req.body;
    const { userProfileId } = req.user;
    try {
      if (e) throw e;
      const { avatar, banner } = hasOwnAvatarAndBanner(req.files);
      const isEmpty = userProfileData(name, bio, website, avatar, banner);

      if (!isEmpty) throw new RequestError("Uppsie, it's empty");

      await updateUserProfileService(
        userProfileId,
        name,
        bio,
        website,
        avatar,
        banner,
      );
      const timelapse = getTimelapse(beforeTime);
      return res
        .status(200)
        .json({ message: 'success', timelapse: `${timelapse} ms`, error: [] });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ message: 'failed', timelapse: null, error: error.message });
    }
  });
};

module.exports = {
  getUserSettings,
  updateUserSettings,
  updateUserPassword,
  updateUserProfile,
};
