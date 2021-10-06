const { PrismaClient } = require('@prisma/client');
const path = require('path');

const upload = require('../middlewares/upload');

const prisma = new PrismaClient();

const getTweetPage = (req, res) => (
  res.sendFile(path.join(__dirname, '../views/index.html'))
);

const addTweet = async (req, res) => {
  upload(req, res, async (error) => {
    try {
      if (error) throw error;
      const tweets = req.body.tweets || null;

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

module.exports = {
  getTweetPage,
  addTweet,
};
