const { PrismaClient } = require('@prisma/client');

const upload = require('../middlewares/upload');

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

      await prisma.tweet_parent.create({ data: createOptions });
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
      Object.prototype.hasOwnProperty.call(getTweetOptions, 'cursor')
      && Object.prototype.hasOwnProperty.call(getTweetOptions, 'skip')
    ) {
      delete getTweetOptions.cursor;
      delete getTweetOptions.skip;
    }

    const tweets = await prisma.tweet_parent.findMany(getTweetOptions);
    return res.json({ cursor: tweets[tweets.length - 1].id, tweets });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'tweet failed to fetch',
    });
  }
};

const getInfiniteTweets = async (req, res) => {
  try {
    let cursor = parseInt(req.params.cursor, 10);

    getTweetOptions.cursor = { id: cursor };
    getTweetOptions.skip = 1;

    const tweets = await prisma.tweet_parent.findMany(getTweetOptions);

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
    const tweet = await prisma.tweet_parent.findUnique({
      where: { id: req.params.id },
      include: {
        tweet_child: {
          select: { id: true, tweet: true },
        },
        tweet_photos: {
          select: { images: true },
        },
      },
    });

    return res.status(200).json(tweet);
  } catch (error) {
    return res.status(404).json({
      message: 'Tweet not found',
    });
  }
};

const deleteTweet = async (req, res) => {
  try {
    let { idParent: id } = req.params;
    id = parseInt(id, 10);
    await prisma.tweet_parent.update({
      where: { id },
      data: {
        tweet_child: { deleteMany: { id_tweet_parent: id } },
        tweet_photos: { deleteMany: { id_tweet_parent: id } },
      },
    });
    await prisma.tweet_parent.delete({
      where: { id },
    });
    return res.status(200).json({
      message: 'tweet successed to deleted',
    });
  } catch (error) {
    return res.status(400).json({
      message: 'tweet failed to delete',
    });
  }
};

const updateTweet = async (req, res) => {
  try {
    const { idParent, idChild = null } = req.params;
    const { tweet } = req.body;

    const updateOptions = {
      where: { id: idParent },
      data: { tweet },
    };

    if (idChild) {
      updateOptions.data = {
        tweet_child: {
          update: {
            where: { id: parseInt(idChild, 10) },
            data: { tweet },
          },
        },
      };
    }

    await prisma.tweet_parent.update(updateOptions);
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
