const isUrlParamInt = (req, res, next) => {
  let isNumber = true;
  Object.keys(req.params).forEach((key) => {
    if (!Number(req.params[key])) {
      isNumber = false;
    }
  });
  if (!isNumber) {
    return res.status(400).json({
      timelapse: null,
      curosr: null,
      tweets: null,
      error: 'Your URL is invalid, please double check it :D',
    });
  }
  return next();
};

module.exports = isUrlParamInt;
