/**
 * check the user if user is already log in
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const hasUserLogin = (req, res, next) => {
  const { JERAWAT } = req.cookies;
  // get user data on redis based on JERAWAT
  // if user key not exists, then throw an error
  // if user exists then call next function
  next();
};
module.exports = hasUserLogin;
