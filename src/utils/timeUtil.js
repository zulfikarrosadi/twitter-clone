const getTimelapse = (beforeTime) => {
  const afterTime = new Date().getTime();
  return afterTime - beforeTime;
};

module.exports = getTimelapse;
