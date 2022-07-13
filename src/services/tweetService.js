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

const updateTweetById = async (data) => {
  const result = await prisma.tweetParent.update(data);
  return result;
};

const getPhotofilename = async (id) => {
  // get the uploaded tweet photo filename based on join with tweet result join
  const result = await prisma.$queryRaw(
    Prisma.sql`SELECT tp.images AS tweet_photos
    FROM tweet_parent AS tps
    JOIN tweet_photos AS tp
    ON tps.id = tp.id_tweet_parent
    WHERE tps.id = ${id}`,
  );
  return result;
};

const deleteRelatedTweetChildAndTweetPhotos = async (id) => {
  const result = await prisma.tweetParent.update({
    where: { id },
    data: {
      tweet_child: { deleteMany: { idTweetParent: id } },
      tweet_photos: { deleteMany: { idTweetParent: id } },
    },
  });
  return result;
};

const deleteTweetParentById = async (id) => {
  const result = await prisma.tweetParent.delete({
    where: { id },
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
