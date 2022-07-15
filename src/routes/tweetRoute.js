const { Router } = require('express');
const {
  addTweet,
  getTweets,
  getInfiniteTweets,
  getSingleTweet,
  deleteTweet,
  updateTweet,
} = require('../controllers/tweetController');
const requiredLogin = require('../middlewares/requiredLogin');
const isUrlParamInt = require('../middlewares/validateUrlParam');

const router = Router();

router.get('/', getTweets);
router.get('/infinite/:cursor', isUrlParamInt, getInfiniteTweets);
router.get('/:id', isUrlParamInt, getSingleTweet);

router.use('/', requiredLogin);

router.post('/', addTweet);
router.delete('/:idParent', isUrlParamInt, deleteTweet);
router.patch('/:idParent', isUrlParamInt, updateTweet);
router.patch('/:idParent/:idChild', isUrlParamInt, updateTweet);

module.exports = router;
