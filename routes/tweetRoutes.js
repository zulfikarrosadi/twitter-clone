const { Router } = require('express');
const { getTweetPage, addTweet } = require('../controllers/tweetControllers');

const router = Router();

router.get('/', (req, res) => res.send('work'));
router.get('/create-tweet', getTweetPage);
router.post('/create-tweet', addTweet);

module.exports = router;
