const { body } = require('express-validator');

const userValidationSchema = [
  body('email').isEmail().withMessage('Please enter valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password should have minimum 6 chars length'),
  body('username')
    .isAlphanumeric()
    .withMessage('Username should only contains number and alphabet only!')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username can only contains 3 - 20 characters long'),
];

module.exports = userValidationSchema;
