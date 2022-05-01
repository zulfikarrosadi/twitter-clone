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
      date_of_birth: true,
    },
  });
  return result;
};

const updateUserSettingsService = async (
  userId,
  username,
  avatar,
  dateOfBirth,
) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      avatar,
      username,
      date_of_birth: dateOfBirth,
    },
  });
  return result;
};

module.exports = {
  createUser,
  getUser,
  getUserSettingsService,
  updateUserSettingsService,
};
