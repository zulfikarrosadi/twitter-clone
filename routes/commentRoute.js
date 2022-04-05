const { Router } = require('express');
const {
  addComment,
  getComments,
  getInfinteComment,
  deleteComment,
} = require('../controllers/commentController');
const hasUserLogin = require('../middlewares/hasUserLogin');

const router = Router();

router.get('/:idTweet', getComments);
router.get('/:idTweet/:cursor', getInfinteComment);

router.use('/', hasUserLogin);

router.post('/:idTweet', addComment);
router.delete('/:idComment', deleteComment);

module.exports = router;
