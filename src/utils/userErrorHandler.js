/**
 * Unique Constraint Error Handler
 * @param errorMessage e
 * @param reqeustBodyObject body
 * @returns errors[]
 */
const uniqueConstraintErrorHandler = (e, body) => {
  const errors = [];
  if (e.split(' ').includes('`email`')) {
    errors.push({
      path: 'email',
      value: body.email,
      message: 'This email is already registered!',
    });
  } else if (e.split(' ').includes('`username`')) {
    errors.push({
      path: 'username',
      value: body.username,
      message: 'This username is takken, please choose another username',
    });
  }
  return errors;
};

/**
 * User Validation Error handler at Express level
 */
const mappingUserError = (errors) => {
  const error = errors.array().map((e) => ({
    path: e.param,
    value: e.value,
    message: e.msg,
  }));
  return error;
};

module.exports = {
  uniqueConstraintErrorHandler,
  mappingUserError,
};
