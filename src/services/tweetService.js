const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

const createTweet = async (options) => {
  const result = await prisma.tweetParent.create({
    data: options,
    select: { id: true, tweet: true },
  });
  return result;
};

const getSingleTweetById = async (idTweetParent) => {
  const result = await prisma.tweetParent.findUnique({
    where: { id: idTweetParent },
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
  });
  return result;
};

const getAllTweets = async () => {
  const result = await prisma.tweetParent.findMany({
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
      _count: { select: { like: true, retweet: true, tweet_comment: true } },
    },
  });
  return result;
};

const getInfiniteTweetsByCursor = async (cursor) => {
  const result = await prisma.tweetParent.findMany({
    orderBy: { createdAt: 'desc' },
    cursor: { id: cursor },
    skip: 1,
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
  });
  return result;
};

const updateTweetById = async (userProfileId, data) => {
  try {
    const result = await prisma.user.update({
      where: { id: userProfileId },
      data: { tweet_parent: { update: data } },
    });
    return result;
  } catch (error) {
    return error;
  }
};

const getPhotofilename = async (id) => {
  const result = await prisma.tweetParent.findFirst({
    where: { id },
    include: {
      tweet_photos: { select: { images: true } },
    },
  });

  return result;
};

const deleteRelatedTweetChildAndTweetPhotos = async (userProfileId, id) => {
  try {
    const result = await prisma.user.update({
      where: { id: userProfileId },
      data: {
        tweet_parent: {
          update: {
            where: { id },
            data: {
              tweet_child: { deleteMany: { idTweetParent: id } },
              tweet_photos: { deleteMany: { idTweetParent: id } },
            },
          },
        },
      },
      select: {
        id: true,
        tweet_parent: {
          include: { tweet_child: true, tweet_photos: true },
        },
      },
    });
    return result;
  } catch (error) {
    return error;
  }
};

const deleteTweetParentById = async (userProfileId, id) => {
  const result = await prisma.user.update({
    where: { id: userProfileId },
    data: { tweet_parent: { delete: { id } } },
    select: { id: true, tweet_parent: { where: { id } } },
  });
  return result;
};

module.exports = {
  createTweet,
  getSingleTweetById,
  getInfiniteTweetsByCursor,
  getAllTweets,
  updateTweetById,
  getPhotofilename,
  deleteRelatedTweetChildAndTweetPhotos,
  deleteTweetParentById,
};
