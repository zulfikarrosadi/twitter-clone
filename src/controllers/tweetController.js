const deleteMultipleFiles = require('../utils/fileUtil');
const errorHanlder = require('../utils/errorHanlder');
const getTimelapse = require('../utils/timeUtil');
const {
  getSingleTweetById,
  getPhotofilename,
  deleteRelatedTweetChildAndTweetPhotos,
  getInfiniteTweetsByCursor,
  deleteTweetParentById,
  getAllTweets,
  createTweet,
  updateTweetById,
} = require('../services/tweetService');
const {
  tweetSaveValidation,
  tweetUpdateValidation,
  getCursor,
} = require('../utils/tweetUtils');
const { RequestError } = require('../errors/RequestError');
const multer = require('../middlewares/upload');
const { MAX_FILE_ITEM } = require('../constant/config');

const addTweet = async (req, res) => {
  const beforeTime = new Date().getTime();
  const upload = multer.array('tweetPhotos', MAX_FILE_ITEM);

  upload(req, res, async (e) => {
    const { tweets } = req.body;

    try {
      if (e) throw e;
      if (!tweets && req.files.length < 1) throw Error('tweet is null');

      const { userProfileId } = req.user;
      const createOptions = tweetSaveValidation(
        tweets,
        req.files,
        userProfileId,
      );

      const result = await createTweet(createOptions);
      const timelapse = getTimelapse(beforeTime);

      return res.status(201).json({
        timelapse: `${timelapse} ms`,
        curosr: null,
        tweets: { id: result.id },
        error: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        timelapse: null,
        curosr: null,
        tweets: null,
        error: errorHanlder(error.message || error),
      });
    }
  });
};

const getTweets = async (req, res) => {
  const beforeTime = new Date().getTime();

  try {
    const tweets = await getAllTweets();
    if (!tweets.length) throw new Error('Tweet not found');
    const timelapse = getTimelapse(beforeTime);

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      curosr: tweets[tweets.length - 1].id,
      tweets,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      timelapse: null,
      curosr: null,
      tweets: null,
      error: errorHanlder(error.message),
    });
  }
};

const getInfiniteTweets = async (req, res) => {
  const beforeTime = new Date().getTime();
  let cursor = parseInt(req.params.cursor, 10);

  try {
    const tweets = await getInfiniteTweetsByCursor(cursor);
    cursor = getCursor(tweets);
    const timelapse = getTimelapse(beforeTime);

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      cursor,
      tweets,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      timelapse: null,
      curosr: null,
      tweets: null,
      error: errorHanlder('No more tweet'),
    });
  }
};

const getSingleTweet = async (req, res) => {
  const beforeTime = new Date().getTime();
  const id = parseInt(req.params.id, 10);

  try {
    const tweet = await getSingleTweetById(id);
    if (!tweet) throw Error('Tweet not found');
    const timelapse = getTimelapse(beforeTime);

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      curosr: null,
      tweets: tweet,
      error: null,
    });
  } catch (error) {
    return res.status(404).json({
      timelapse: null,
      curosr: null,
      tweets: null,
      error: errorHanlder(error.message),
    });
  }
};

const deleteTweet = async (req, res) => {
  const id = parseInt(req.params.idParent, 10);
  const { userProfileId } = req.user;
  try {
    const photoFileNames = await getPhotofilename(id);
    if (photoFileNames.length) {
      const fileName = photoFileNames.map((item) => item.tweet_photos);
      deleteMultipleFiles(fileName);
    }

    const result = await deleteRelatedTweetChildAndTweetPhotos(
      userProfileId,
      id,
    );
    if (result.code && result.code === 'P2016') {
      throw new RequestError('Somethings wrong', 400);
    }

    await deleteTweetParentById(userProfileId, id);

    return res.status(204).send('deleted');
  } catch (error) {
    console.log(error);
    return res.status(error.code || 404).json({
      timelapse: null,
      curosr: null,
      tweets: null,
      error: error.message || errorHanlder('Tweet not found'),
    });
  }
};

const updateTweet = async (req, res) => {
  const beforeTime = new Date().getTime();

  const id = parseInt(req.params.idParent, 10);
  const idChild = parseInt(req.params.idChild, 10) || null;

  const { tweet } = req.body;
  const { userProfileId } = req.user;
  try {
    if (!tweet) throw new RequestError('Tweet cannot be empty', 400);
    const updateOptions = tweetUpdateValidation(id, idChild, tweet);
    const result = await updateTweetById(userProfileId, updateOptions);

    // if user try to update other person tweet
    if (result.code === 'P2016') {
      throw new RequestError('Somethings wrong', 400);
    }

    const timelapse = getTimelapse(beforeTime);

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      curosr: null,
      tweets: { id: result.id },
      error: null,
    });
  } catch (error) {
    console.log(error);

    return res.status(error.code || 400).json({
      timelapse: null,
      curosr: null,
      tweets: null,
      error: error.message || "Tweet that you're search for, is doesn't exists",
    });
  }
};

module.exports = {
  addTweet,
  getTweets,
  getInfiniteTweets,
  getSingleTweet,
  deleteTweet,
  updateTweet,
};
