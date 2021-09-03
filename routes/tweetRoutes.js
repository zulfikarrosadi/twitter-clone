const { Router } = require('express');
const {
  tweet_create_get,
  tweet_create_post,
} = require('../controllers/tweetControllers');

const router = Router();

router.get('/', (req, res) => res.send('work'));
router.get('/create-tweet', tweet_create_get);
router.post('/create-tweet', tweet_create_post);

module.exports = router;
