/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

const { expect } = require('chai');
const { beforeEach, afterEach } = require('mocha');
const {
  createTweet,
  getSingleTweetById,
  getAllTweets,
} = require('../src/services/tweetService');
const { tweetSaveValidation } = require('../src/utils/tweetUtils');
const { tweets, registerNewUser, clearTestDatabase } = require('./helper');

describe('tweet service', () => {
  let userSettings;
  let userProfile;
  beforeEach(async () => {
    const { userProfileId, userSettingId } = await registerNewUser();
    userSettings = userSettingId;
    userProfile = userProfileId;
  });

  afterEach(async () => {
    await clearTestDatabase(userSettings);
  });

  describe('create tweet', () => {
    it('should create new tweet', async () => {
      const options = tweetSaveValidation(tweets, null, userProfile);
      const result = await createTweet(options);

      expect(result.tweet).to.be.equal('tweet parent test');
    });
  });

  describe('get single tweet by id', () => {
    let tweet;
    before(async () => {
      const { userProfileId } = await registerNewUser();
      const options = tweetSaveValidation(tweets, null, userProfileId);
      tweet = await createTweet(options);
    });
    it('should return tweet that we searched for', async () => {
      const result = await getSingleTweetById(tweet.id);
      expect(result.tweet).to.be.equal(tweet.tweet);
    });
  });

  describe('get all tweets', () => {
    before(async () => {
      const { userProfileId } = await registerNewUser();
      const options = tweetSaveValidation(tweets, null, userProfileId);
      await createTweet(options);
    });

    it('should get all tweets', async () => {
      const result = await getAllTweets();

      expect(result[0]).to.haveOwnProperty('id');
      expect(result[0]).to.haveOwnProperty('tweet');
      expect(result[0]).to.haveOwnProperty('authorId');
      expect(result[0]).to.haveOwnProperty('tweet_child');
    });
  });
});
