const { Router } = require('express');
const {
  addComment,
  getComments,
  getInfinteComment,
  deleteComment,
} = require('../controllers/commentController');

const router = Router();

router.post('/:idTweet', addComment);
router.get('/:idTweet', getComments);
router.get('/:idTweet/:cursor', getInfinteComment);
router.delete('/:idComment', deleteComment);

module.exports = router;
