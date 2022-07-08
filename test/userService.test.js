/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const { expect } = require('chai');
const { beforeEach, afterEach } = require('mocha');
const { PrismaClient } = require('@prisma/client');
const {
  createUserProfile,
  createUserSettings,
  getUserProfileService,
  updateUserProfileService,
  getUserSettingsService,
  updateUserSettingsService,
  updateUserPasswordService,
} = require('../src/services/userService');
const { hashPassword } = require('../src/utils/userUtil');
const { validUserProfile, validUpdatedUserProfile } = require('./helper');

const prisma = new PrismaClient();

describe('User Service', () => {
  describe('user settings', () => {
    let userSettings;
    beforeEach(async () => {
      userSettings = await createUserSettings(
        'zulfikarr',
        'zulfikar@test.com',
        await hashPassword('password'),
        1,
        new Date(),
      );
    });
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.userSetting.deleteMany();
    });

    describe('create user settings', () => {
      it('should create new user settings', async () => {
        const result = await createUserSettings(
          'zulfikarTest',
          'zulfikarTest@test.com',
          await hashPassword('password'),
          1,
          new Date(),
        );

        expect(result.username).to.be.equal('zulfikarTest');
      });
    });

    describe('get user settings', () => {
      it('should get user settings', async () => {
        const result = await getUserSettingsService(userSettings.username);

        expect(result.username).to.be.equal('zulfikarr');
        expect(result.email).to.be.equal('zulfikar@test.com');
      });
    });

    describe('update user settings', () => {
      it('should update user settings', async () => {
        const result = await updateUserSettingsService(
          userSettings.id,
          'usernameUpdate',
          'zulfikarUpdate@test.com',
          new Date(),
          2,
        );

        expect(result.username).to.be.equal('usernameUpdate');
        expect(result.email).to.be.equal('zulfikarUpdate@test.com');
      });
    });

    describe('update user password', () => {
      it('should update user password', async () => {
        const newPassword = 'new password';
        const result = await updateUserPasswordService(
          userSettings.id,
          newPassword,
        );

        expect(result.id).to.be.equal(userSettings.id);
      });
    });
  });

  describe('user profile', () => {
    let userProfile;
    let userSettings;
    let result;
    beforeEach(async () => {
      userSettings = await createUserSettings(
        'zulfikarr',
        'zulfikar@test.com',
        await hashPassword('password'),
        1,
        new Date(),
      );
      userProfile = await createUserProfile(
        ...validUserProfile,
        userSettings.id,
      );
    });
    afterEach(async () => {
      await prisma.user.deleteMany();
      await prisma.userSetting.deleteMany();
    });

    describe('create user profile', () => {
      it('should create new user profile', async () => {
        result = await createUserProfile(...validUserProfile, userSettings.id);
        expect(result.name).to.be.equal('zulfikar');
      });
      describe('given null input execpt for name data', () => {
        it('should return no error', async () => {
          const res = await createUserProfile(
            'some name',
            null,
            null,
            userSettings.id,
          );
          expect(res.name).to.be.equal('some name');
        });
      });
    });

    describe('get user profile', () => {
      it('should get user profile', async () => {
        result = await getUserProfileService(userProfile.id);

        expect(result.name).to.be.equal('zulfikar');
        expect(result.bio).to.be.equal('bio testing');
      });
    });

    describe('update user profile service', () => {
      it('should update the user profile', async () => {
        result = await updateUserProfileService(
          userProfile.id,
          ...validUpdatedUserProfile,
        );

        expect(result.name).to.be.equal('rosadi');
        expect(result.bio).to.be.equal('bio update');
        expect(result.website).to.be.equal('https://rosadi.com');
      });
    });
  });
});
