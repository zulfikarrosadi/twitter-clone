/**
 * check the user if user is already log in
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
const requiredLogin = async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      timelapse: null,
      cursor: null,
      tweets: null,
      error: 'You required to login to do this action',
    });
  }
  return next();
};
module.exports = requiredLogin;
