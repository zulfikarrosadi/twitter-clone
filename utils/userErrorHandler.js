/**
 * Unique Constraint Error Handler
 * @param errorMessage e
 * @param reqeustBodyObject body
 * @returns errors[]
 */
const uniqueConstraintErrorHandler = (e, body) => {
  const errors = [];
  console.log(e);
  if (e.split(' ').includes('`email_unique`')) {
    errors.push({
      path: 'email',
      value: body.email,
      message: 'This email is already registered!',
    });
  }
  if (e.split(' ').includes('`username_unique`')) {
    errors.push({
      path: 'email',
      value: body.email,
      message: 'This email is already registered!',
    });
  }
  return errors;
};

/**
 * User Validation Error handler at Express level
 */
const userValidationErrorHandler = (errors) => {
  const error = errors.array().map((e) => ({
    path: e.param,
    value: e.value,
    message: e.msg,
  }));
  return error;
};

module.exports = {
  uniqueConstraintErrorHandler,
  userValidationErrorHandler,
};
