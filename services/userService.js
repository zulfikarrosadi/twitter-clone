const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createUser = async (email, password, username) => {
  const result = await prisma.user.create({
    data: { email, password, username },
  });
  return result;
};

module.exports = { createUser };
