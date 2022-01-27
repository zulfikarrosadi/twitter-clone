const { Router } = require('express');
const {
  addTweet,
  getTweets,
  getInfiniteTweets,
  getSingleTweet,
  deleteTweet,
  updateTweet,
  addComment,
} = require('../controllers/tweetControllers');

const router = Router();

router.get('/', getTweets);
router.get('/infinite/:cursor', getInfiniteTweets);
router.get('/:id', getSingleTweet);

router.post('/', addTweet);
router.delete('/:idParent', deleteTweet);
router.patch('/:idParent/', updateTweet);
router.patch('/:idParent/:idChild', updateTweet);

router.post('/:idParent/comments', addComment);

module.exports = router;
