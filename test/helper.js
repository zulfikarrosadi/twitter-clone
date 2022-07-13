const { PrismaClient } = require('@prisma/client');
const { createTweet } = require('../src/services/tweetService');
const { tweetSaveValidation } = require('../src/utils/tweetUtils');
const { generateUsername } = require('../src/utils/generateUsername');
const { hashPassword } = require('../src/utils/userUtil');
const {
  createUserSettings,
  createUserProfile,
} = require('../src/services/userService');

const prisma = new PrismaClient();

const tweets = [
  'tweet parent test',
  'tweet child test',
  'tweet child again',
  'tweet child again',
  'tweet child again',
  'tweet child again',
  'tweet child again',
  'tweet child again',
];

async function fakeUserSettingData() {
  const username = generateUsername('zulfikar');
  const email = `${username}@testing.com`;
  const password = await hashPassword('password');
  const genderId = 1; // male
  const dateBirth = new Date();

  return [username, email, password, genderId, dateBirth];
}

function fakeUserProfileData() {
  const name = `zulfikar${Math.random() * 1000}`;
  const bio = 'bio example';
  const website = 'example.com';

  return [name, bio, website];
}

async function registerNewUser() {
  const userSettingsData = await fakeUserSettingData();
  const userProfileData = fakeUserProfileData();
  const userSettings = await createUserSettings(...userSettingsData);
  const userProfile = await createUserProfile(
    ...userProfileData,
    userSettings.id,
  );

  return { userSettingId: userSettings.id, userProfileId: userProfile.id };
}

async function createTweets(userId) {
  const options = tweetSaveValidation(this.tweets, null, userId);
  const result = await createTweet(options);
  return result;
}

async function clearTestDatabase(userSettingId) {
  await prisma.tweetChild.deleteMany();
  await prisma.tweetPhoto.deleteMany();
  await prisma.tweetParent.deleteMany();
  await prisma.userSetting.update({
    where: { id: userSettingId },
    data: {
      user: { deleteMany: {} },
    },
  });
  await prisma.userSetting.deleteMany();
}

module.exports = {
  newUser: {
    email: 'testemail@test.com',
    password: 'password',
    username: 'testusername',
    dateOfBirth: new Date(),
    genderId: 1,
    name: 'test name',
  },

  validUser: {
    email: 'testemail@test.com',
    username: 'testusername',
    password: 'password',
  },

  invalidUser: {
    email: 'test@email.com',
    username: 'testusername',
    password: 'invalidUser',
  },

  validUserProfile: ['zulfikar', 'bio testing', 'https://zulfikar.com'],
  validUpdatedUserProfile: ['rosadi', 'bio update', 'https://rosadi.com'],

  registerNewUser,
  tweets,
  createTweets,
  clearTestDatabase,
};
