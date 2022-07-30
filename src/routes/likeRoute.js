const { Router } = require('express');
const { addLikeHandler } = require('../controllers/likeController');
const requiredLogin = require('../middlewares/requiredLogin');
const isUrlParamInt = require('../middlewares/validateUrlParam');

const router = Router();

router.use(requiredLogin);
router.use(isUrlParamInt);

router.post('/:tweetParentId', addLikeHandler);
router.post('/:tweetParentId/:tweetChildId', addLikeHandler);

module.exports = router;
