const { PrismaClient } = require('@prisma/client');
const upload = require('../middlewares/upload');
const {
  getSingleTweetById,
  getPhotofilename,
  deleteRelatedTweetChildAndTweetPhotos,
  deleteTweetParentById,
  getAllTweets,
  createTweet,
  updateTweetById,
} = require('../services/tweetService');
const deleteMultipleFiles = require('../utils/deleteMultipleFiles');

const prisma = new PrismaClient();

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
  },
};

const addTweet = async (req, res) => {
  upload(req, res, async (error) => {
    try {
      if (error) throw error;

      const { tweets = null } = req.body;
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

      await createTweet(createOptions);

      return res.status(201).json({
        message: 'tweet success created',
      });
    } catch (errors) {
      console.log(errors);
      return res.status(400).json({
        message: 'tweet failed to create',
      });
    }
  });
};

const getTweets = async (req, res) => {
  try {
    if (
      Object.prototype.hasOwnProperty.call(getTweetOptions, 'cursor') &&
      Object.prototype.hasOwnProperty.call(getTweetOptions, 'skip')
    ) {
      delete getTweetOptions.cursor;
      delete getTweetOptions.skip;
    }

    const tweets = await getAllTweets(getTweetOptions);
    if (!tweets.length) throw new Error('No tweet found');

    return res.json({ cursor: tweets[tweets.length - 1].id, tweets });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: `tweet failed to fetch, ${error.message}`,
    });
  }
};

const getInfiniteTweets = async (req, res) => {
  try {
    let cursor = parseInt(req.params.cursor, 10);

    getTweetOptions.cursor = { id: cursor };
    getTweetOptions.skip = 1;

    const tweets = await getAllTweets(getTweetOptions);
    cursor = tweets[tweets.length - 1].id;

    return res.status(200).json({ cursor, tweets });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'There is no more tweets to load',
    });
  }
};

const getSingleTweet = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const tweet = await getSingleTweetById(id);

    return res.status(200).json(tweet);
  } catch (error) {
    return res.status(404).json({
      message: 'Tweet not found',
    });
  }
};

const deleteTweet = async (req, res) => {
  try {
    const id = parseInt(req.params.idParent, 10);

    const photoFileNames = await getPhotofilename(id);
    if (photoFileNames.length) {
      const fileName = photoFileNames.map((item) => item.tweet_photos);
      deleteMultipleFiles(fileName);
    }

    await deleteRelatedTweetChildAndTweetPhotos(id);
    await deleteTweetParentById(id);

    return res.status(200).json({
      message: 'tweet successed to deleted',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'tweet failed to delete',
    });
  }
};

const updateTweet = async (req, res) => {
  try {
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

    await updateTweetById(updateOptions);

    return res.status(200).json({
      message: 'tweet successed to update',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'tweet failed to update',
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
