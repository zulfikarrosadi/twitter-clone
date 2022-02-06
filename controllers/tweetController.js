const upload = require('../middlewares/upload');
const deleteMultipleFiles = require('../utils/deleteMultipleFiles');
const errorHanlder = require('../utils/errorHanlder');
const getCursor = require('../utils/getCursor');
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

const addTweet = async (req, res) => {
  upload(req, res, async (e) => {
    const beforeTime = new Date().getTime();
    const { tweets } = req.body;
    const createOptions = { tweet: tweets };

    if (Array.isArray(tweets)) {
      createOptions.tweet = tweets.shift();
      createOptions.tweet_child = {
        createMany: {
          data: tweets.map((tweet) => ({
            tweet,
          })),
        },
      };
    }

    if (req.files) {
      createOptions.tweet_photos = {
        createMany: {
          data: req.files.map((file) => ({
            images: file.filename,
          })),
        },
      };
    }
    try {
      if (e) throw e;
      if (!tweets && !req.files) throw Error('tweet is null');

      const result = await createTweet(createOptions);

      const afterTime = new Date().getTime();
      const timelapse = afterTime - beforeTime;

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
        error: errorHanlder(error),
      });
    }
  });
};

const getTweets = async (req, res) => {
  const beforeTime = new Date().getTime();

  try {
    const tweets = await getAllTweets();
    if (!tweets.length) throw new Error('Tweet not found');

    const afterTime = new Date().getTime();
    const timelapse = afterTime - beforeTime;

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

    const afterTime = new Date().getTime();
    const timelapse = afterTime - beforeTime;

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

    const afterTime = new Date().getTime();
    const timelapse = afterTime - beforeTime;

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
  const beforeTime = new Date().getTime();
  const id = parseInt(req.params.idParent, 10);

  try {
    const photoFileNames = await getPhotofilename(id);
    if (photoFileNames.length) {
      const fileName = photoFileNames.map((item) => item.tweet_photos);
      deleteMultipleFiles(fileName);
    }

    await deleteRelatedTweetChildAndTweetPhotos(id);
    await deleteTweetParentById(id);

    const afterTime = new Date().getTime();
    const timelapse = afterTime - beforeTime;

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      curosr: null,
      tweets: { id },
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      timelapse: null,
      curosr: null,
      tweets: null,
      error: errorHanlder('Tweet not found'),
    });
  }
};

const updateTweet = async (req, res) => {
  const beforeTime = new Date().getTime();
  const id = parseInt(req.params.idParent, 10);
  const idChild = parseInt(req.params.idChild, 10) || null;
  const { tweet } = req.body;

  const updateOptions = {
    where: { id },
    data: { tweet },
  };

  if (idChild) {
    updateOptions.data = {
      tweet_child: {
        update: {
          where: { id: idChild },
          data: { tweet },
        },
      },
    };
  }
  try {
    const result = await updateTweetById(updateOptions);

    const afterTime = new Date().getTime();
    const timelapse = afterTime - beforeTime;

    return res.status(200).json({
      timelapse: `${timelapse} ms`,
      curosr: null,
      tweets: { id: result.id },
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      timelapse: null,
      curosr: null,
      tweets: null,
      error: errorHanlder('Tweet not found'),
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