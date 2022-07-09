const { body } = require('express-validator');

const userValidationSchema = [
  body('email').isEmail().withMessage('Please enter valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password should have minimum 6 chars length'),
  body('name')
    .isAlpha()
    .withMessage('Your name should only contain alphabet only')
    .isLength({ min: 4, max: 25 })
    .withMessage(
      'Your name should have minimun 4 and maximum 20 characters only',
    ),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Please enter a valid date format'),
];

const userLoginValidationSchema = [
  userValidationSchema[0],
  userValidationSchema[1],
];

module.exports = { userValidationSchema, userLoginValidationSchema };
