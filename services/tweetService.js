const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getSingleTweetById = async (id) => {
  const tweet = await prisma.tweet_parent.findUnique({
    where: { id },
    include: {
      tweet_child: {
        select: { id: true, tweet: true },
      },
      tweet_photos: {
        select: { images: true },
      },
    },
  });
  return tweet;
};

module.exports = { getSingleTweetById };
