const { addLike } = require('../services/likeService');
const { validateCreateLikeSchema } = require('../utils/likeUtil');

const addLikeHandler = async (req, res) => {
  const { userProfileId } = req.user;
  const tweetParentId = parseInt(req.params.tweetParentId, 10);
  const tweetChildId = parseInt(req.params.tweetChildId, 10);
  try {
    const data = validateCreateLikeSchema(
      userProfileId,
      tweetParentId,
      tweetChildId,
    );
    await addLike(data);
    return res.status(200).send('liekd');
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

module.exports = { addLikeHandler };
