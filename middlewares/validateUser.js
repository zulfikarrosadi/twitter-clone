const { validationResult } = require('express-validator');
const { userValidationErrorHandler } = require('../utils/userErrorHandler');

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const errorResult = userValidationErrorHandler(errors);

  return res
    .status(400)
    .json({ timelapse: null, userId: null, errors: errorResult });
};

module.exports = validate;
