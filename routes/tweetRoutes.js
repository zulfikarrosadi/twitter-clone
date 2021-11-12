const { Router } = require('express');
const {
  addTweet,
  getTweets,
  getInfiniteTweets,
  getSingleTweet,
  deleteTweet,
  updateTweet,
} = require('../controllers/tweetControllers');

const router = Router();

router.get('/', getTweets);
router.get('/infinite/:cursor', getInfiniteTweets);
router.get('/:id', getSingleTweet);

router.post('/', addTweet);
router.delete('/:idParent', deleteTweet);
router.patch('/:idParent/', updateTweet);
router.patch('/:idParent/:idChild', updateTweet);

module.exports = router;
