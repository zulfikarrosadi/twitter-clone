const { Router } = require('express');
const formData = require('express-form-data');
const {
  userRegistrationValidationSchema,
  userLoginValidationSchema,
} = require('../constant/userValidationSchema');
const {
  addUser,
  loginUser,
  logOutUser,
} = require('../controllers/authController');
const validateUser = require('../middlewares/validateUser');

const router = Router();

router.use(formData.parse());

router.post(
  '/register',
  validateUser(userRegistrationValidationSchema),
  addUser,
);
router.post('/login', validateUser(userLoginValidationSchema), loginUser);
router.post('/logout', logOutUser);

module.exports = router;
