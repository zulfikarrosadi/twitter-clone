const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createComment = async (idParent, comment) => {
  try {
    const result = await prisma.tweet_comment.create({
      data: {
        id_tweet_parent: idParent,
        content: comment,
      },
      select: { id: true },
    });
    return result;
  } catch (error) {
    return error;
  }
};

const getAllCommentsByIdTweet = async (idTweet) => {
  const result = await prisma.tweet_comment.findMany({
    where: { id_tweet_parent: idTweet },
    take: 10,
    select: { id: true, content: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const deleteCommentById = async (idTweet, idComment) => {
  try {
    const result = await prisma.tweet_comment.delete({
      where: { id: idComment },
      select: { id: true },
    });

    return result;
  } catch (error) {
    return error;
  }
};

module.exports = { createComment, getAllCommentsByIdTweet, deleteCommentById };
