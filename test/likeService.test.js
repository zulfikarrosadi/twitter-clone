/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

const { expect } = require('chai');
const { addLike, getLike } = require('../src/services/likeService');
const {
  createTweet,
  getSingleTweetById,
} = require('../src/services/tweetService');
const {
  validateCreateLikeSchema,
  validateGetLikeSchema,
} = require('../src/utils/likeUtil');
const { tweetSaveValidation } = require('../src/utils/tweetUtils');
const { clearTestDatabase, registerNewUser } = require('./helper');

describe('like service', () => {
  let userSettings;
  let userProfile;
  let tweet;
  beforeEach(async () => {
    const { userProfileId, userSettingId } = await registerNewUser();
    const options = tweetSaveValidation(
      ['tweet parent', 'tweet child'],
      null,
      userProfileId,
    );
    const newTweet = await createTweet(options);
    tweet = await getSingleTweetById(newTweet.id);
    userSettings = userSettingId;
    userProfile = userProfileId;
  });

  afterEach(async () => {
    await clearTestDatabase(userSettings);
  });

  describe('like tweet parent', () => {
    it('should like the tweet parent', async () => {
      const option = validateCreateLikeSchema(userProfile, tweet.id, null);
      const result = await addLike(option);

      expect(result.id).to.be.not.NaN;
    });
  });

  describe('like tweet child', () => {
    it('should like the tweet child', async () => {
      const option = validateCreateLikeSchema(
        userProfile,
        tweet.id,
        tweet.tweet_child[0].id,
      );
      const result = await addLike(option);

      expect(result.id).to.be.not.NaN;
    });
  });

  describe('get total of likes on tweet parent and tweet child', () => {
    it('should get like from tweet parent and tweet child', async () => {
      const option = validateCreateLikeSchema(
        userProfile,
        tweet.id,
        tweet.tweet_child[0].id,
      );
      await addLike(option);
      await addLike(option);
      await addLike(option);
      await addLike(option);

      const opt = validateGetLikeSchema(null, tweet.tweet_child[0].id);
      const result = await getLike(opt);

      expect(result).to.be.equal(4);
    });
  });
});
