const { Router } = require('express');
const {
  getTweetPage,
  addTweet,
  getTweets,
  getInfiniteTweets,
} = require('../controllers/tweetControllers');

const router = Router();

router.get('/', (req, res) => res.send('work'));
router.get('/create-tweet', getTweetPage);
router.post('/create-tweet', addTweet);
router.get('/tweets', getTweets);
router.get('/tweets/infinite/:cursor', getInfiniteTweets);

module.exports = router;
