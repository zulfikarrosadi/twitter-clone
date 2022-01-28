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

module.exports = { createComment };
