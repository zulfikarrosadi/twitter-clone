const validateCreateLikeSchema = (
  userProfileId,
  tweetParentId,
  tweetChildId,
) => {
  const option = { userProfileId, tweetParentId };
  if (tweetChildId) option.tweetChildId = tweetChildId;

  return option;
};

const validateGetLikeSchema = (tweetParentId, tweetChildId) => {
  const option = {};

  if (tweetParentId) option.where = { tweetParentId };
  if (tweetChildId) {
    option.where = { tweetChildId };
    delete option.where.tweetParentId;
  }
  return option;
};

module.exports = { validateCreateLikeSchema, validateGetLikeSchema };
