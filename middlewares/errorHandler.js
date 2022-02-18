// eslint-disable-next-line arrow-body-style
const errorHanlder = (err, req, res, next) => {
  res.status(400).json({ message: err.message });
  next();
};
module.exports = errorHanlder;
