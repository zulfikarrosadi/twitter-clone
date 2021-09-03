const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

const tweet_create_get = (req, res) => {
  return res.sendFile(path.join(__dirname, '../views/index.html'));
};

const tweet_create_post = async (req, res) => {
  try {
    const { tweets } = req.body;
    const tweetParent = await prisma.tweet_parent.create({
      data: {
        tweet: tweets.shift(),
      },
    });

    let tweetChild;
    if (tweets.length > 1) {
      tweetChild = await prisma.tweet_child.createMany({
        data: tweets.map((tweetChild) => ({
          id_parent: tweetParent.id,
          tweet: tweetChild,
        })),
      });
    }

    return res.status(201).json({
      message: 'tweet success created',
      idTweetParent: tweetParent.id,
      countTweetChild: tweetChild.count,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'tweet failed to create',
    });
  }
};

module.exports = {
  tweet_create_get,
  tweet_create_post,
};
