const { createUser } = require('../services/userService');
const { uniqueConstraintErrorHandler } = require('../utils/userErrorHandler');

// TODO
// - error handling for unique constraint
// - make error response schema and more reuesable
// - express validator
// - hash password
// - utils to get timelapse

const addUser = async (req, res) => {
  const beforeTime = new Date().getTime();
  const { email, password, username } = req.body;

  try {
    const result = await createUser(email, password, username);

    const afterTime = new Date().getTime();
    const timelapse = afterTime - beforeTime;

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      userId: result.id,
      error: null,
    });
  } catch (error) {
    console.log('catch', req.body);
    console.log(error);
    return res.status(400).json({
      timelapse: null,
      userId: null,
      errors: uniqueConstraintErrorHandler(error.message, req.body),
    });
  }
};

module.exports = { addUser };
