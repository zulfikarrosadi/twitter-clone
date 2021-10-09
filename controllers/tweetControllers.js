const { PrismaClient } = require('@prisma/client');
const path = require('path');

const upload = require('../middlewares/upload');

const prisma = new PrismaClient();

const getTweetPage = (req, res) => (
  res.sendFile(path.join(__dirname, '../views/index.html'))
);

/**
  const tweetParent = await prisma.tweet_parent.create({
      data: { tweet: tweets },
    });

    if (Array.isArray(tweets)) {
      await prisma.tweet_child.createMany({
        data: tweets.map((tweetChild) => ({
          id_parent: tweetParent.id,
          tweet: tweetChild,
        })),
      });
    }

    if (req.files) {
      await prisma.tweet_photos.createMany({
        data: req.files.map((file) => ({
          id_tweet_parent: tweetParent.id,
          images: file.filename,
        })),
      });
    }
 */

const addTweet = async (req, res) => {
  upload(req, res, async (error) => {
    try {
      if (error) throw error;

      const tweets = req.body.tweets || null;
      const createOptions = { data: { tweet: tweets } };
      if (Array.isArray(tweets)) {
        createOptions.data.tweet = tweets.shift();
      }
      const tweetParent = await prisma.tweet_parent.create(createOptions);

      if (Array.isArray(tweets)) {
        await prisma.tweet_child.createMany({
          data: tweets.map((tweetChild) => ({
            id_tweet_parent: tweetParent.id,
            tweet: tweetChild,
          })),
        });
      }

      if (req.files) {
        await prisma.tweet_photos.createMany({
          data: req.files.map((file) => ({
            id_tweet_parent: tweetParent.id,
            images: file.filename,
          })),
        });
      }

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
    const tweets = await prisma.tweet_parent.findMany({
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
    });

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
    const tweets = await prisma.tweet_parent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      cursor: { id: cursor },
      skip: 1,
      include: {
        tweet_child: {
          select: { id: true, tweet: true },
        },
        tweet_photos: {
          select: { images: true },
        },
      },
    });

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
      where: { id: parseInt(req.params.id, 10) },
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

module.exports = {
  getTweetPage,
  addTweet,
  getTweets,
  getInfiniteTweets,
  getSingleTweet,
};
