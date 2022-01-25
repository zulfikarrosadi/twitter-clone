const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

const createTweet = async (options) => {
  try {
    await prisma.tweet_parent.create({ data: options });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

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

const getAllTweets = async (options) => {
  try {
    const tweets = await prisma.tweet_parent.findMany(options);
    return tweets;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getPhotofilename = async (id) => {
  try {
    const photoFileNames = await prisma.$queryRaw(
      Prisma.sql`SELECT tp.images AS tweet_photos FROM tweet_parent AS tps
      JOIN tweet_photos AS tp ON tps.id = tp.id_tweet_parent WHERE tps.id = ${id}`,
    );
    return photoFileNames;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const deleteRelatedTweetChildAndTweetPhotos = async (id) => {
  try {
    await prisma.tweet_parent.update({
      where: { id },
      data: {
        tweet_child: { deleteMany: { id_tweet_parent: id } },
        tweet_photos: { deleteMany: { id_tweet_parent: id } },
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteTweetParentById = async (id) => {
  try {
    await prisma.tweet_parent.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  createTweet,
  getSingleTweetById,
  getAllTweets,
  getPhotofilename,
  deleteRelatedTweetChildAndTweetPhotos,
  deleteTweetParentById,
};
