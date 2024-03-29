const { Router } = require('express');
const formData = require('express-form-data');
const {
  getUserSettings,
  updateUserSettings,
  updateUserProfile,
  updateUserPassword,
} = require('../controllers/userController');
const requiredLogin = require('../middlewares/requiredLogin');

const router = Router();

router.use(requiredLogin);

router.patch('/profile', updateUserProfile);

router.use(formData.parse());

router.get('/settings', getUserSettings);
router.patch('/settings/information', updateUserSettings);
router.patch('/settings/password', updateUserPassword);

module.exports = router;
