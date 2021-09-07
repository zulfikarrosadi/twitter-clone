const { PrismaClient } = require('@prisma/client');
const path = require('path');

const upload = require('../middlewares/upload');

const prisma = new PrismaClient();

const tweet_create_get = (req, res) => {
  return res.sendFile(path.join(__dirname, '../views/index.html'));
};

const tweet_create_post = async (req, res) => {
  upload(req, res, async (error) => {
    try {
      if (error) throw error;
      const { tweets } = req.body;
      const tweetParent = await prisma.tweet_parent.create({
        data: { tweet: tweets },
      });

      if (Array.isArray(tweets)) {
        let tweetChild = await prisma.tweet_child.createMany({
          data: tweets.map((tweetChild) => ({
            id_parent: tweetParent.id,
            tweet: tweetChild,
          })),
        });
      }

      if (req.files) {
        const tweetPhotos = await prisma.tweet_photos.createMany({
          data: req.files.map((file) => ({
            id_tweet_parent: tweetParent.id,
            images: file.filename,
          })),
        });
      }

      return res.status(201).json({
        message: 'tweet success created',
        idTweetParent: tweetParent.id,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: 'tweet failed to create',
      });
    }
  });
};

module.exports = {
  tweet_create_get,
  tweet_create_post,
};
