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
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
    },
  });
  return result;
};

const getUserSettingsService = async (userId) => {
  const result = prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      avatar: true,
      is_username_edited: true,
      date_of_birth: true,
    },
  });
  return result;
};

module.exports = { createUser, getUser, getUserSettingsService };
