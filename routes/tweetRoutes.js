const { Router } = require('express');
const {
  addTweet,
  getTweets,
  getInfiniteTweets,
  getSingleTweet,
  deleteTweet,
} = require('../controllers/tweetControllers');

const router = Router();

router.get('/', (req, res) => res.send('work'));
router.get('/tweets', getTweets);
router.get('/tweets/infinite/:cursor', getInfiniteTweets);
router.get('/tweet/:id', getSingleTweet);

router.post('/create-tweet', addTweet);
router.delete('/tweet', deleteTweet);

module.exports = router;
