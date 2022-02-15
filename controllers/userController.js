const { createUser } = require('../services/userService');
const { uniqueConstraintErrorHandler } = require('../utils/userErrorHandler');
const hashPassword = require('../utils/hashPassword');
const getTimelapse = require('../utils/getTimelapse');

// TODO
// - error handling for unique constraint
// - make error response schema and more reuesable
// - express validator
// - hash password
// - utils to get timelapse (considering using prisma.$use middleware to use logging)
// - do some research about the best response schema from rest api
// - how to know uesr ip js

const addUser = async (req, res) => {
  const beforeTime = new Date().getTime();
  const { email, password, username } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const result = await createUser(email, hashedPassword, username);

    const timelapse = getTimelapse(beforeTime);

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
