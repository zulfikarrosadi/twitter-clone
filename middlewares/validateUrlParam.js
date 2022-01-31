const errorHandler = require('../utils/errorHanlder');

const isUrlParamInt = (req, res, next) => {
  for (const params in req.params) {
    if (Object.hasOwnProperty.call(req.params, params)) {
      const element = req.params[params];
      const isNumber = !!Number(element);

      if (!isNumber) {
        return res.status(400).json({
          timelapse: null,
          curosr: null,
          tweets: null,
          error: errorHandler('Request Url Invalid'),
        });
      }
    }
  }
  return next();
};

module.exports = isUrlParamInt;
