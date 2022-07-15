const { Router } = require('express');
const {
  getUserSettings,
  updateUserSettings,
  updateUserProfile,
  updateUserPassword,
} = require('../controllers/userController');
const hasUserLogin = require('../middlewares/hasUserLogin');

const router = Router();

router.use(hasUserLogin);

router.get('/settings', getUserSettings);
router.patch('/settings/information', updateUserSettings);
router.patch('/settings/password', updateUserPassword);
// router.patch('/profile', updateUserProfile);

module.exports = router;
