const { Router } = require('express');
const userValidationSchema = require('../constant/userValidationSchema');
const {
  addUser,
  loginUser,
  logOutUser,
  getUserSettings,
  updateUserSettings,
} = require('../controllers/userController');
const hasUserLogin = require('../middlewares/hasUserLogin');
const validateUser = require('../middlewares/validateUser');

const router = Router();

router.post('/register', validateUser(userValidationSchema), addUser);
router.post('/login', validateUser(userValidationSchema), loginUser);

router.use(hasUserLogin);

router.post('/logout', logOutUser);
router.get('/settings', getUserSettings);
router.post('/settings', updateUserSettings);

module.exports = router;
