const validateCreateLikeSchema = (
  userProfileId,
  tweetParentId,
  tweetChildId,
) => {
  const option = { userProfileId, tweetParentId };
  if (tweetChildId) option.tweetChildId = tweetChildId;

  return option;
};

module.exports = { validateCreateLikeSchema };
