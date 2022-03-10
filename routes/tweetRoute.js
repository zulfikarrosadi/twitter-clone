const { Router } = require('express');
const {
  addTweet,
  getTweets,
  getInfiniteTweets,
  getSingleTweet,
  deleteTweet,
  updateTweet,
} = require('../controllers/tweetController');
const hasUserLogin = require('../middlewares/hasUserLogin');
const isUrlParamInt = require('../middlewares/validateUrlParam');

const router = Router();

router.get('/', getTweets);
router.get('/infinite/:cursor', isUrlParamInt, getInfiniteTweets);
router.get('/:id', isUrlParamInt, getSingleTweet);

router.post('/', hasUserLogin, addTweet);
router.delete('/:idParent', isUrlParamInt, hasUserLogin, deleteTweet);
router.patch('/:idParent/', isUrlParamInt, hasUserLogin, updateTweet);
router.patch('/:idParent/:idChild', isUrlParamInt, hasUserLogin, updateTweet);

module.exports = router;
