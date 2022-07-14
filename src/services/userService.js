const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createUserSettings = async (
  username,
  email,
  password,
  genderId,
  dateOfBirth,
) => {
  const result = await prisma.userSetting.create({
    data: {
      email,
      password,
      username,
      genderId,
      dateBirth: dateOfBirth,
    },
    select: { id: true, username: true },
  });
  return result;
};

const createUserProfile = async (name, bio, website, userSettingId) => {
  const result = await prisma.user.create({
    data: {
      name,
      bio,
      website,
      user_settings: { connect: { id: userSettingId } },
    },
  });
  return result;
};

const getUserProfileService = async (id) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      bio: true,
      website: true,
      createdAt: true,
      avatar: true,
      banner: true,
      userSettingId: true,
    },
  });
  return result;
};

const updateUserProfileService = async (
  id,
  name,
  bio,
  website,
  avatar,
  banner,
) => {
  const result = await prisma.user.update({
    where: { id },
    data: {
      name,
      bio,
      website,
      avatar,
      banner,
    },
  });

  return result;
};

const getUserSettingsService = async (username) => {
  const result = prisma.userSetting.findUnique({
    where: { username },
    include: {
      user: {
        select: {
          id: true,
        },
      },
      genders: {
        select: {
          name: true,
        },
      },
    },
  });
  return result;
};

const updateUserSettingsService = async (
  id,
  username,
  email,
  dateOfBirth,
  genderId,
) => {
  const result = await prisma.userSetting.update({
    where: { id },
    data: {
      username,
      email,
      dateBirth: dateOfBirth,
      genderId,
    },
  });
  return result;
};

const updateUserPasswordService = async (userSettingId, newPassword) => {
  const result = await prisma.userSetting.update({
    where: { id: userSettingId },
    data: { password: newPassword },
    select: { id: true },
  });

  return result;
};

module.exports = {
  createUserProfile,
  createUserSettings,
  getUserProfileService,
  updateUserProfileService,
  getUserSettingsService,
  updateUserSettingsService,
  updateUserPasswordService,
};
