const upload = require('../middlewares/upload');
const deleteMultipleFiles = require('../utils/deleteMultipleFiles');
const {
  getSingleTweetById,
  getPhotofilename,
  deleteRelatedTweetChildAndTweetPhotos,
  deleteTweetParentById,
  getAllTweets,
  createTweet,
  updateTweetById,
} = require('../services/tweetService');
const errorHanlder = require('../utils/errorHanlder');

const getTweetOptions = {
  orderBy: { createdAt: 'desc' },
  take: 10,
  include: {
    tweet_child: {
      select: { id: true, tweet: true },
    },
    tweet_photos: {
      select: { images: true },
    },
    tweet_comment: {
      select: { id: true, content: true },
      take: 2,
    },
  },
};

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
  if (
    Object.prototype.hasOwnProperty.call(getTweetOptions, 'cursor') &&
    Object.prototype.hasOwnProperty.call(getTweetOptions, 'skip')
  ) {
    delete getTweetOptions.cursor;
    delete getTweetOptions.skip;
  }
  try {
    const tweets = await getAllTweets(getTweetOptions);
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
    return res.status(400).json({
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

  getTweetOptions.cursor = { id: cursor };
  getTweetOptions.skip = 1;
  try {
    const tweets = await getAllTweets(getTweetOptions);
    cursor = tweets[tweets.length - 1].id;

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
  let { idParent: id, idChild = null } = req.params;
  const { tweet } = req.body;

  id = parseInt(id, 10);
  idChild = parseInt(idChild, 10);

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
