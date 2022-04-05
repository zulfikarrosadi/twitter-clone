const { getSession } = require('../services/redisService');

/**
 * check the user if user is already log in
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
const hasUserLogin = async (req, res, next) => {
  const { JERAWAT } = req.cookies;

  const user = await getSession(JERAWAT);
  if (!user) {
    return res
      .status(403)
      .json({ message: 'You required to login to do this action' });
  }
  req.user = JSON.parse(user);
  return next();
};
module.exports = hasUserLogin;
