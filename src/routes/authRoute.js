const { Router } = require('express');
const {
  userValidationSchema,
  userLoginValidationSchema,
} = require('../constant/userValidationSchema');
const {
  addUser,
  loginUser,
  logOutUser,
} = require('../controllers/authController');
const validateUser = require('../middlewares/validateUser');

const router = Router();

router.post('/register', validateUser(userValidationSchema), addUser);
router.post('/login', validateUser(userLoginValidationSchema), loginUser);
router.post('/logout', logOutUser);

module.exports = router;
