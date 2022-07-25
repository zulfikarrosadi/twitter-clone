const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const addLike = async (data) => {
  const result = await prisma.like.create({ data });
  return result;
};

module.exports = { addLike };
