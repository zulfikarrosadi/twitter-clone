const { Router } = require('express');
const {
  userValidationSchema,
  userLoginValidationSchema,
} = require('../constant/userValidationSchema');
const {
  addUser,
  loginUser,
  logOutUser,
  getUserSettings,
  updateUserSettings,
  updateUserProfile,
  updateUserPassword,
} = require('../controllers/userController');
const hasUserLogin = require('../middlewares/hasUserLogin');
const validateUser = require('../middlewares/validateUser');

const router = Router();

router.post('/register', validateUser(userValidationSchema), addUser);
router.post('/login', validateUser(userLoginValidationSchema), loginUser);

router.use(hasUserLogin);

router.post('/logout', logOutUser);
router.get('/settings', getUserSettings);
router.patch('/settings/information', updateUserSettings);
// router.patch('/settings/password', updateUserPassword);
// router.patch('/profile', updateUserProfile);

module.exports = router;
