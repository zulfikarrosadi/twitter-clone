const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createComment = async (idParent, comment, user) => {
  try {
    const result = await prisma.tweetComment.create({
      data: {
        idTweetParent: idParent,
        content: comment,
        authorId: user,
      },
      select: { id: true },
    });
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getAllCommentsByIdTweet = async (idTweet) => {
  const result = await prisma.tweetComment.findMany({
    where: { idTweetParent: idTweet },
    take: 10,
    select: {
      id: true,
      content: true,
      createdAt: true,
      authorId: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const getInfinteCommentByCursor = async (idTweet, latestCursor) => {
  const result = await prisma.tweetComment.findMany({
    orderBy: { createdAt: 'desc' },
    cursor: { id: latestCursor },
    skip: 1,
    where: { idTweetParent: idTweet },
    take: 10,
    select: {
      id: true,
      idTweetParent: true,
      authorId: true,
      content: true,
      createdAt: true,
    },
  });
  return result;
};

const deleteCommentById = async (idTweet, idComment) => {
  try {
    const result = await prisma.tweetComment.delete({
      where: { id: idComment },
      select: { id: true },
    });

    return result;
  } catch (error) {
    return error;
  }
};

module.exports = {
  createComment,
  getAllCommentsByIdTweet,
  getInfinteCommentByCursor,
  deleteCommentById,
};
