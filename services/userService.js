const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createUser = async (email, password, username) => {
  const result = await prisma.user.create({
    data: { email, password, username },
  });
  return result;
};

const getUser = async (email) => {
  const result = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });
  return result;
};

module.exports = { createUser, getUser };
