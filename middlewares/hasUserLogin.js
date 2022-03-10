const { getSession } = require('../services/redisService');

/**
 * check the user if user is already log in
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const hasUserLogin = async (req, res, next) => {
  const { JERAWAT } = req.cookies;

  const user = await getSession(JERAWAT);
  if (!user) return res.status(403).send('bitches');

  req.body.user = JSON.parse(user).userId;
  return next();
};
module.exports = hasUserLogin;
