/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

const { expect } = require('chai');
const { beforeEach, afterEach } = require('mocha');
const {
  createTweet,
  getSingleTweetById,
  getAllTweets,
  updateTweetById,
  deleteTweetParentById,
  deleteRelatedTweetChildAndTweetPhotos,
} = require('../src/services/tweetService');
const {
  tweetSaveValidation,
  tweetUpdateValidation,
} = require('../src/utils/tweetUtils');
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

  describe('update the tweet', () => {
    let createNewTweet;
    let createdTweet;
    beforeEach(async () => {
      const { userProfileId } = await registerNewUser();
      const options = tweetSaveValidation(tweets, null, userProfileId);
      createNewTweet = await createTweet(options);
      createdTweet = await getSingleTweetById(createNewTweet.id);
    });

    describe('update the tweet parent', () => {
      it('should update the parent tweet with given data', async () => {
        const updateOption = tweetUpdateValidation(
          createNewTweet.id,
          null,
          'update the tweet parent',
        );
        const result = await updateTweetById(updateOption);

        expect(result.id).to.be.equal(createNewTweet.id);
        expect(result.tweet).to.be.not.equal(createNewTweet.tweet);
        expect(result.tweet).to.be.equal('update the tweet parent');
      });
    });

    describe('update the tweet child', () => {
      it('should update the tweet child with given data', async () => {
        const options = tweetUpdateValidation(
          createNewTweet.id,
          createdTweet.tweet_child[0].id,
          'updated tweet child',
        );

        await updateTweetById(options);
        const updatedTweet = await getSingleTweetById(createNewTweet.id);

        expect(updatedTweet.tweet_child[0].id).to.be.equal(
          createdTweet.tweet_child[0].id,
        );
        expect(updatedTweet.tweet_child[0].tweet).to.be.equal(
          'updated tweet child',
        );
      });
    });
  });

  describe('delete the parent tweet', () => {
    let tweetParent;
    before(async () => {
      const { userProfileId } = await registerNewUser();
      const option = tweetSaveValidation(['tweet parent'], null, userProfileId);
      tweetParent = await createTweet(option);
    });
    it('should delete the tweet parent', async () => {
      const result = await deleteTweetParentById(tweetParent.id);

      expect(result).to.have.property('id');
      expect(result).to.have.property('tweet');
      expect(result).to.have.property('createdAt');
      expect(result).to.have.property('updatedAt');
      expect(result).to.have.property('authorId');
    });
  });

  describe('delete related tweet child and tweet photos', () => {
    let tweetParent;

    before(async () => {
      const { userProfileId } = await registerNewUser();
      const option = tweetSaveValidation(
        ['tweet parent', 'tweet child'],
        null,
        userProfileId,
      );
      tweetParent = await createTweet(option);
    });
    it('should delete all related tweet', async () => {
      const result = await deleteRelatedTweetChildAndTweetPhotos(
        tweetParent.id,
      );

      expect(result).to.have.property('id');
      expect(result).to.have.property('tweet');
      expect(result).to.have.property('createdAt');
      expect(result).to.have.property('updatedAt');
      expect(result).to.have.property('authorId');
    });
  });
});
