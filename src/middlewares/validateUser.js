const { validationResult } = require('express-validator');
const { mappingUserError } = require('../utils/userErrorHandler');

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const errorResult = mappingUserError(errors);

  return res
    .status(400)
    .json({ timelapse: null, user: null, errors: errorResult });
};

module.exports = validate;
