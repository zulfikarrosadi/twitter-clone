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

      let tweetChild;
      if (Array.isArray(tweets)) {
        tweetChild = await prisma.tweet_child.createMany({
          data: tweets.map((tweetChild) => ({
            id_parent: tweetParent.id,
            tweet: tweetChild,
          })),
        });
      }

      if (req.file) {
        const tweetPhotos = await prisma.tweet_photos.create({
          data: { id_tweet_parent: tweetParent.id, images: req.file.filename },
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
